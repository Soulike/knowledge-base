import { Octokit } from "@octokit/rest";

const apiVersion = "2022-11-28";
const noOp = (): void => undefined;

export type GitHubIssue = {
  author: string | null;
  body: string;
  number: number;
  open: boolean;
  pullRequest: boolean;
  title: string;
};

export type GitHubIssueComment = {
  author: string | null;
  body: string;
};

export type NewIssue = {
  assignee: string;
  body: string;
  labels: string[];
  title: string;
};

export interface IssuePublisher {
  comment(issueNumber: number, body: string): Promise<void>;
  create(issue: NewIssue): Promise<number>;
  ensureLabel(name: string, color: string, description: string): Promise<void>;
  get(issueNumber: number): Promise<GitHubIssue | undefined>;
  listIssueComments(issueNumber: number): Promise<GitHubIssueComment[]>;
  listOpenIssues(): Promise<GitHubIssue[]>;
}

function hasStatus(error: unknown, status: number): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === status
  );
}

function issue(data: {
  body?: string | null;
  number: number;
  pull_request?: unknown;
  state: string;
  title: string;
  user?: { login: string } | null;
}): GitHubIssue {
  return {
    author: data.user?.login ?? null,
    body: data.body ?? "",
    number: data.number,
    open: data.state === "open",
    pullRequest: data.pull_request !== undefined,
    title: data.title,
  };
}

export class GitHubIssuePublisher implements IssuePublisher {
  readonly #name: string;
  readonly #octokit: Octokit;
  readonly #owner: string;

  constructor(repository: string, token: string) {
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
      userAgent: "knowledge-base-content-verification",
    });
  }

  async ensureLabel(
    name: string,
    color: string,
    description: string,
  ): Promise<void> {
    try {
      await this.#octokit.rest.issues.getLabel({
        name,
        owner: this.#owner,
        repo: this.#name,
      });
      return;
    } catch (error) {
      if (!hasStatus(error, 404)) {
        throw error;
      }
    }

    try {
      await this.#octokit.rest.issues.createLabel({
        color,
        description,
        name,
        owner: this.#owner,
        repo: this.#name,
      });
    } catch (error) {
      if (!hasStatus(error, 422)) {
        throw error;
      }
      try {
        await this.#octokit.rest.issues.getLabel({
          name,
          owner: this.#owner,
          repo: this.#name,
        });
      } catch {
        throw error;
      }
    }
  }

  async get(issueNumber: number): Promise<GitHubIssue | undefined> {
    try {
      const { data } = await this.#octokit.rest.issues.get({
        issue_number: issueNumber,
        owner: this.#owner,
        repo: this.#name,
      });
      return issue(data);
    } catch (error) {
      if (hasStatus(error, 404)) {
        return undefined;
      }
      throw error;
    }
  }

  async listOpenIssues(): Promise<GitHubIssue[]> {
    const issues = await this.#octokit.paginate(
      this.#octokit.rest.issues.listForRepo,
      {
        owner: this.#owner,
        per_page: 100,
        repo: this.#name,
        state: "open",
      },
    );
    return issues.map(issue);
  }

  async listIssueComments(issueNumber: number): Promise<GitHubIssueComment[]> {
    const comments = await this.#octokit.paginate(
      this.#octokit.rest.issues.listComments,
      {
        issue_number: issueNumber,
        owner: this.#owner,
        per_page: 100,
        repo: this.#name,
      },
    );
    return comments.map((comment) => ({
      author: comment.user?.login ?? null,
      body: comment.body ?? "",
    }));
  }

  async create(newIssue: NewIssue): Promise<number> {
    const { data } = await this.#octokit.rest.issues.create({
      assignees: [newIssue.assignee],
      body: newIssue.body,
      labels: newIssue.labels,
      owner: this.#owner,
      repo: this.#name,
      title: newIssue.title,
    });
    return data.number;
  }

  async comment(issueNumber: number, body: string): Promise<void> {
    await this.#octokit.rest.issues.createComment({
      body,
      issue_number: issueNumber,
      owner: this.#owner,
      repo: this.#name,
    });
  }
}
