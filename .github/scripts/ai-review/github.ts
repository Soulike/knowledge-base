import { Octokit } from "@octokit/rest";

const apiVersion = "2022-11-28";
const noOp = (): void => undefined;

export type PullRequest = {
  baseSha: string;
  headSha: string;
  htmlUrl: string;
  number: number;
  state: string;
};

export type PullRequestReview = {
  authorLogin: string | null;
  body: string | null;
  commitSha: string | null;
  id: number;
  state: string;
  submittedAt: string | null;
};

export type PullRequestReviewComment = {
  body: string;
  id: number;
  reviewId: number | null;
};

export type WorkflowJob = {
  completedAt: string | null;
  conclusion: string | null;
  id: number;
  name: string;
  startedAt: string;
  status: string;
};

function hasStatus(error: unknown, status: number): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === status
  );
}

export class GitHubClient {
  readonly #name: string;
  readonly #octokit: Octokit;
  readonly #owner: string;

  constructor(token: string, repository: string) {
    if (!token) {
      throw new Error("A GitHub token is required.");
    }
    const parts = repository.split("/");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error("Repository must use the owner/name form.");
    }
    [this.#owner, this.#name] = parts;
    this.#octokit = new Octokit({
      auth: token,
      log: {
        debug: noOp,
        error: noOp,
        info: noOp,
        warn: noOp,
      },
      request: {
        headers: {
          "X-GitHub-Api-Version": apiVersion,
        },
      },
      userAgent: "knowledge-base-ai-review",
    });
  }

  async getPullRequest(prNumber: number): Promise<PullRequest> {
    const { data } = await this.#octokit.rest.pulls.get({
      owner: this.#owner,
      pull_number: prNumber,
      repo: this.#name,
    });
    return {
      baseSha: data.base.sha,
      headSha: data.head.sha,
      htmlUrl: data.html_url,
      number: data.number,
      state: data.state,
    };
  }

  async removeLabel(prNumber: number, label: string): Promise<void> {
    try {
      await this.#octokit.rest.issues.removeLabel({
        issue_number: prNumber,
        name: label,
        owner: this.#owner,
        repo: this.#name,
      });
    } catch (error) {
      if (hasStatus(error, 404)) {
        return;
      }
      throw error;
    }
  }

  async addLabel(prNumber: number, label: string): Promise<void> {
    await this.#octokit.rest.issues.addLabels({
      issue_number: prNumber,
      labels: [label],
      owner: this.#owner,
      repo: this.#name,
    });
  }

  async listReviews(prNumber: number): Promise<PullRequestReview[]> {
    const reviews = await this.#octokit.paginate(
      this.#octokit.rest.pulls.listReviews,
      {
        owner: this.#owner,
        per_page: 100,
        pull_number: prNumber,
        repo: this.#name,
      },
    );
    return reviews.map((review) => ({
      authorLogin: review.user?.login ?? null,
      body: review.body ?? null,
      commitSha: review.commit_id,
      id: review.id,
      state: review.state,
      submittedAt: review.submitted_at ?? null,
    }));
  }

  async listReviewComments(
    prNumber: number,
  ): Promise<PullRequestReviewComment[]> {
    const comments = await this.#octokit.paginate(
      this.#octokit.rest.pulls.listReviewComments,
      {
        owner: this.#owner,
        per_page: 100,
        pull_number: prNumber,
        repo: this.#name,
      },
    );
    return comments.map((comment) => ({
      body: comment.body,
      id: comment.id,
      reviewId: comment.pull_request_review_id ?? null,
    }));
  }

  async listRunAttemptJobs(
    runId: number,
    runAttempt: number,
  ): Promise<WorkflowJob[]> {
    const jobs: WorkflowJob[] = [];
    let page = 1;
    let totalCount: number;
    do {
      const parameters = {
        attempt_number: runAttempt,
        owner: this.#owner,
        per_page: 100,
        repo: this.#name,
        run_id: runId,
        ...(page === 1 ? {} : { page }),
      };
      const { data } =
        await this.#octokit.rest.actions.listJobsForWorkflowRunAttempt(
          parameters,
        );
      jobs.push(
        ...data.jobs.map((job) => ({
          completedAt: job.completed_at,
          conclusion: job.conclusion,
          id: job.id,
          name: job.name,
          startedAt: job.started_at,
          status: job.status,
        })),
      );
      totalCount = data.total_count;
      page += 1;
    } while (jobs.length < totalCount);
    return jobs;
  }
}
