import type {
  ConfirmationIssue,
  ConfirmationIssueComment,
  ConfirmationIssueRepository,
} from "./inconclusive-resolution.ts";

type GitHubIssueResponse = {
  body: string | null;
  html_url: string;
  labels: Array<{ name?: string } | string>;
  number: number;
  pull_request?: unknown;
  state: string;
  title: string;
  user: { login?: string } | null;
};

type GitHubCommentResponse = {
  author_association?: string;
  body: string | null;
  html_url: string;
  id: number;
  issue_url: string;
};

function fail(message: string): never {
  throw new Error(`GitHub confirmation issue adapter: ${message}`);
}

function issue(response: GitHubIssueResponse): ConfirmationIssue {
  if (response.state !== "open" && response.state !== "closed") {
    fail(`issue #${String(response.number)} has unsupported state.`);
  }
  return {
    authorLogin: response.user?.login ?? "",
    body: response.body ?? "",
    htmlUrl: response.html_url,
    labels: response.labels
      .map((label) => (typeof label === "string" ? label : label.name))
      .filter((label): label is string => typeof label === "string"),
    number: String(response.number),
    pullRequest: response.pull_request !== undefined,
    state: response.state,
    title: response.title,
  };
}

export class GitHubConfirmationIssueRepository implements ConfirmationIssueRepository {
  readonly #apiUrl: string;
  readonly #fetch: typeof fetch;
  readonly #owner: string;
  readonly #repo: string;
  readonly #token: string;

  constructor(input: {
    apiUrl?: string;
    fetch?: typeof fetch;
    owner: string;
    repo: string;
    token: string;
  }) {
    this.#apiUrl = (input.apiUrl ?? "https://api.github.com").replace(
      /\/$/u,
      "",
    );
    this.#fetch = input.fetch ?? globalThis.fetch;
    this.#owner = input.owner;
    this.#repo = input.repo;
    this.#token = input.token;
  }

  async #request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await this.#fetch(`${this.#apiUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.#token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...init?.headers,
      },
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 1000);
      fail(
        `${init?.method ?? "GET"} ${path} failed with ${String(response.status)}: ${detail}`,
      );
    }
    return (await response.json()) as T;
  }

  async createIssue(input: {
    assignees: string[];
    body: string;
    labels: string[];
    title: string;
  }): Promise<ConfirmationIssue> {
    const response = await this.#request<GitHubIssueResponse>(
      `/repos/${encodeURIComponent(this.#owner)}/${encodeURIComponent(this.#repo)}/issues`,
      {
        body: JSON.stringify(input),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );
    return issue(response);
  }

  async getComment(commentId: string): Promise<ConfirmationIssueComment> {
    const response = await this.#request<GitHubCommentResponse>(
      `/repos/${encodeURIComponent(this.#owner)}/${encodeURIComponent(this.#repo)}/issues/comments/${commentId}`,
    );
    const issueUrlPrefix = `${this.#apiUrl}/repos/${this.#owner}/${this.#repo}/issues/`;
    const issueNumber = response.issue_url.startsWith(issueUrlPrefix)
      ? /^\d+$/u.test(response.issue_url.slice(issueUrlPrefix.length))
        ? response.issue_url.slice(issueUrlPrefix.length)
        : undefined
      : undefined;
    if (!issueNumber) {
      fail(`comment ${commentId} has an invalid issue URL.`);
    }
    return {
      ...(response.author_association === undefined
        ? {}
        : { authorAssociation: response.author_association }),
      body: response.body ?? "",
      htmlUrl: response.html_url,
      id: String(response.id),
      issueNumber,
    };
  }

  async getIssue(issueNumber: string): Promise<ConfirmationIssue> {
    return issue(
      await this.#request<GitHubIssueResponse>(
        `/repos/${encodeURIComponent(this.#owner)}/${encodeURIComponent(this.#repo)}/issues/${issueNumber}`,
      ),
    );
  }

  async listOpenIssues(labels: string[]): Promise<ConfirmationIssue[]> {
    const issues: ConfirmationIssue[] = [];
    const perPage = 100;
    for (let page = 1; ; page += 1) {
      const query = new URLSearchParams({
        labels: labels.join(","),
        page: String(page),
        per_page: String(perPage),
        state: "open",
      });
      const pageIssues = await this.#request<GitHubIssueResponse[]>(
        `/repos/${encodeURIComponent(this.#owner)}/${encodeURIComponent(this.#repo)}/issues?${query.toString()}`,
      );
      issues.push(...pageIssues.map(issue));
      if (pageIssues.length < perPage) {
        return issues;
      }
    }
  }
}
