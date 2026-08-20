import type { ReviewThread } from "./review-state.ts";

const apiVersion = "2022-11-28";

type PullRequest = {
  baseSha: string;
  headSha: string;
  htmlUrl: string;
  number: number;
  state: string;
};

export type PullRequestReview = {
  authorLogin: string | null;
  body: string | null;
  id: number;
};

export type InlineReviewComment = {
  body: string;
  line: number;
  path: string;
  side: "LEFT" | "RIGHT";
};

export class GitHubApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${path} is not an object.`);
  }
  return value as Record<string, unknown>;
}

function requiredString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${path} is not a non-empty string.`);
  }
  return value;
}

function requiredNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw new Error(`${path} is not an integer.`);
  }
  return value;
}

function nullableString(value: unknown, path: string): string | null {
  if (value === null) {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error(`${path} is not a string or null.`);
  }
  return value;
}

export class GitHubClient {
  readonly #name: string;
  readonly #owner: string;
  readonly #token: string;

  constructor(token: string, repository: string) {
    if (!token) {
      throw new Error("A GitHub token is required.");
    }
    const parts = repository.split("/");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error("Repository must use the owner/name form.");
    }
    [this.#owner, this.#name] = parts;
    this.#token = token;
  }

  async #request(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<{ headers: Headers; value: unknown }> {
    const request: RequestInit = {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.#token}`,
        "Content-Type": "application/json",
        "User-Agent": "knowledge-base-ai-review",
        "X-GitHub-Api-Version": apiVersion,
      },
      method,
    };
    if (body !== undefined) {
      request.body = JSON.stringify(body);
    }
    const response = await fetch(`https://api.github.com${path}`, request);
    const text = await response.text();
    let value: unknown = null;
    if (text) {
      try {
        value = JSON.parse(text) as unknown;
      } catch {
        value = text;
      }
    }
    if (!response.ok) {
      const message =
        typeof value === "object" && value !== null && "message" in value
          ? String(value.message)
          : text || response.statusText;
      throw new GitHubApiError(
        `${method} ${path} failed with ${response.status}: ${message}`,
        response.status,
      );
    }
    return { headers: response.headers, value };
  }

  async #graphql(query: string, variables: object): Promise<unknown> {
    const { value } = await this.#request("POST", "/graphql", {
      query,
      variables,
    });
    const response = object(value, "GraphQL response");
    if (Array.isArray(response.errors) && response.errors.length > 0) {
      throw new Error(
        `GitHub GraphQL failed: ${JSON.stringify(response.errors)}`,
      );
    }
    return response.data;
  }

  async getPullRequest(prNumber: number): Promise<PullRequest> {
    const { value } = await this.#request(
      "GET",
      `/repos/${this.#owner}/${this.#name}/pulls/${prNumber}`,
    );
    const pull = object(value, "pull request");
    const head = object(pull.head, "pull request head");
    const base = object(pull.base, "pull request base");
    return {
      baseSha: requiredString(base.sha, "pull request base SHA"),
      headSha: requiredString(head.sha, "pull request head SHA"),
      htmlUrl: requiredString(pull.html_url, "pull request URL"),
      number: requiredNumber(pull.number, "pull request number"),
      state: requiredString(pull.state, "pull request state"),
    };
  }

  async removeLabel(prNumber: number, label: string): Promise<void> {
    try {
      await this.#request(
        "DELETE",
        `/repos/${this.#owner}/${this.#name}/issues/${prNumber}/labels/${encodeURIComponent(label)}`,
      );
    } catch (error) {
      if (error instanceof GitHubApiError && error.status === 404) {
        return;
      }
      throw error;
    }
  }

  async addLabel(prNumber: number, label: string): Promise<void> {
    await this.#request(
      "POST",
      `/repos/${this.#owner}/${this.#name}/issues/${prNumber}/labels`,
      { labels: [label] },
    );
  }

  async listReviews(prNumber: number): Promise<PullRequestReview[]> {
    const reviews: PullRequestReview[] = [];
    for (let page = 1; ; page += 1) {
      const { value } = await this.#request(
        "GET",
        `/repos/${this.#owner}/${this.#name}/pulls/${prNumber}/reviews?per_page=100&page=${page}`,
      );
      if (!Array.isArray(value)) {
        throw new Error("Pull-request reviews response is not an array.");
      }
      for (const itemValue of value) {
        const item = object(itemValue, "pull-request review");
        const user =
          item.user === null ? null : object(item.user, "review user");
        reviews.push({
          authorLogin:
            user === null
              ? null
              : requiredString(user.login, "review user login"),
          body: nullableString(item.body, "review body"),
          id: requiredNumber(item.id, "review id"),
        });
      }
      if (value.length < 100) {
        return reviews;
      }
    }
  }

  async listReviewThreads(prNumber: number): Promise<ReviewThread[]> {
    const query = `
      query ReviewThreads($owner: String!, $name: String!, $number: Int!, $after: String) {
        repository(owner: $owner, name: $name) {
          pullRequest(number: $number) {
            reviewThreads(first: 100, after: $after) {
              nodes {
                id
                isResolved
                comments(first: 100) {
                  nodes {
                    body
                    databaseId
                    author { login }
                  }
                }
              }
              pageInfo { hasNextPage endCursor }
            }
          }
        }
      }
    `;
    const threads: ReviewThread[] = [];
    let after: string | null = null;

    do {
      const data = object(
        await this.#graphql(query, {
          after,
          name: this.#name,
          number: prNumber,
          owner: this.#owner,
        }),
        "GraphQL data",
      );
      const repository = object(data.repository, "GraphQL repository");
      const pullRequest = object(
        repository.pullRequest,
        "GraphQL pull request",
      );
      const connection = object(
        pullRequest.reviewThreads,
        "GraphQL reviewThreads",
      );
      if (!Array.isArray(connection.nodes)) {
        throw new Error("GraphQL reviewThreads.nodes is not an array.");
      }
      for (const nodeValue of connection.nodes) {
        const node = object(nodeValue, "GraphQL review thread");
        const comments = object(
          node.comments,
          "GraphQL review-thread comments",
        );
        if (!Array.isArray(comments.nodes)) {
          throw new Error("GraphQL review-thread comments are not an array.");
        }
        const parsedComments = comments.nodes.map((commentValue, index) => {
          const comment = object(
            commentValue,
            `GraphQL review comment ${index}`,
          );
          const author =
            comment.author === null
              ? null
              : object(comment.author, "GraphQL review-comment author");
          return {
            authorLogin:
              author === null
                ? ""
                : requiredString(author.login, "review-comment author login"),
            body: requiredString(comment.body, "review-comment body"),
            databaseId: requiredNumber(
              comment.databaseId,
              "review-comment databaseId",
            ),
          };
        });
        if (typeof node.isResolved !== "boolean") {
          throw new Error("GraphQL review-thread isResolved is not a boolean.");
        }
        threads.push({
          comments: parsedComments,
          id: requiredString(node.id, "review-thread id"),
          isResolved: node.isResolved,
        });
      }
      const pageInfo = object(connection.pageInfo, "GraphQL pageInfo");
      if (typeof pageInfo.hasNextPage !== "boolean") {
        throw new Error("GraphQL pageInfo.hasNextPage is not a boolean.");
      }
      after = pageInfo.hasNextPage
        ? requiredString(pageInfo.endCursor, "GraphQL pageInfo.endCursor")
        : null;
    } while (after !== null);

    return threads;
  }

  async resolveReviewThread(threadId: string): Promise<void> {
    const mutation = `
      mutation ResolveReviewThread($threadId: ID!) {
        resolveReviewThread(input: {threadId: $threadId}) {
          thread { id isResolved }
        }
      }
    `;
    const data = object(
      await this.#graphql(mutation, { threadId }),
      "resolveReviewThread data",
    );
    const payload = object(
      data.resolveReviewThread,
      "resolveReviewThread payload",
    );
    const thread = object(payload.thread, "resolved review thread");
    if (thread.id !== threadId || thread.isResolved !== true) {
      throw new Error(`GitHub did not resolve review thread ${threadId}.`);
    }
  }

  async replyToReviewComment(
    prNumber: number,
    commentId: number,
    body: string,
  ): Promise<void> {
    await this.#request(
      "POST",
      `/repos/${this.#owner}/${this.#name}/pulls/${prNumber}/comments/${commentId}/replies`,
      { body },
    );
  }

  async createCommentReview(
    prNumber: number,
    headSha: string,
    body: string,
    comments: InlineReviewComment[],
  ): Promise<void> {
    await this.#request(
      "POST",
      `/repos/${this.#owner}/${this.#name}/pulls/${prNumber}/reviews`,
      {
        body,
        comments,
        commit_id: headSha,
        event: "COMMENT",
      },
    );
  }
}
