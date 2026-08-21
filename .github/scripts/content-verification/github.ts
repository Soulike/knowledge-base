export type GitHubIssue = {
  number: number;
  open: boolean;
  pullRequest: boolean;
  title: string;
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
  findOpenByExactTitle(title: string): Promise<GitHubIssue | undefined>;
  get(issueNumber: number): Promise<GitHubIssue | undefined>;
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${path} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function issue(value: unknown): GitHubIssue {
  const item = object(value, "GitHub issue");
  if (!Number.isSafeInteger(item.number) || (item.number as number) < 1) {
    throw new Error("GitHub issue number is invalid.");
  }
  if (typeof item.title !== "string" || item.title.length === 0) {
    throw new Error("GitHub issue title is invalid.");
  }
  if (item.state !== "open" && item.state !== "closed") {
    throw new Error("GitHub issue state is invalid.");
  }
  return {
    number: item.number as number,
    open: item.state === "open",
    pullRequest: item.pull_request !== undefined,
    title: item.title,
  };
}

export class GitHubIssuePublisher implements IssuePublisher {
  readonly #repository: string;
  readonly #token: string;

  constructor(repository: string, token: string) {
    this.#repository = repository;
    this.#token = token;
  }

  async #request(path: string, init: RequestInit = {}): Promise<Response> {
    const response = await fetch(`https://api.github.com${path}`, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.#token}`,
        "Content-Type": "application/json",
        "User-Agent": "knowledge-base-content-verification",
        "X-GitHub-Api-Version": "2022-11-28",
        ...init.headers,
      },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `GitHub API ${init.method ?? "GET"} ${path} failed with ${response.status}: ${body.slice(0, 1000)}`,
      );
    }
    return response;
  }

  async ensureLabel(
    name: string,
    color: string,
    description: string,
  ): Promise<void> {
    const path = `/repos/${this.#repository}/labels/${encodeURIComponent(name)}`;
    const existing = await fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.#token}`,
        "User-Agent": "knowledge-base-content-verification",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (existing.ok) {
      return;
    }
    if (existing.status !== 404) {
      throw new Error(
        `GitHub API GET ${path} failed with ${existing.status}: ${(await existing.text()).slice(0, 1000)}`,
      );
    }
    const creation = await fetch(
      `https://api.github.com/repos/${this.#repository}/labels`,
      {
        body: JSON.stringify({ color, description, name }),
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${this.#token}`,
          "Content-Type": "application/json",
          "User-Agent": "knowledge-base-content-verification",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        method: "POST",
      },
    );
    if (creation.ok) {
      return;
    }
    if (creation.status === 422) {
      const raced = await fetch(`https://api.github.com${path}`, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${this.#token}`,
          "User-Agent": "knowledge-base-content-verification",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      if (raced.ok) {
        return;
      }
    }
    throw new Error(
      `GitHub API POST /repos/${this.#repository}/labels failed with ${creation.status}: ${(await creation.text()).slice(0, 1000)}`,
    );
  }

  async get(issueNumber: number): Promise<GitHubIssue | undefined> {
    const response = await fetch(
      `https://api.github.com/repos/${this.#repository}/issues/${issueNumber}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${this.#token}`,
          "User-Agent": "knowledge-base-content-verification",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    if (response.status === 404) {
      return undefined;
    }
    if (!response.ok) {
      throw new Error(
        `GitHub API GET issue ${issueNumber} failed with ${response.status}: ${(await response.text()).slice(0, 1000)}`,
      );
    }
    return issue(await response.json());
  }

  async findOpenByExactTitle(title: string): Promise<GitHubIssue | undefined> {
    for (let page = 1; ; page += 1) {
      const response = await this.#request(
        `/repos/${this.#repository}/issues?state=open&per_page=100&page=${page}`,
      );
      const value = (await response.json()) as unknown;
      if (!Array.isArray(value)) {
        throw new Error("GitHub open issues response must be an array.");
      }
      const issues = value.map(issue);
      const match = issues.find(
        (candidate) => !candidate.pullRequest && candidate.title === title,
      );
      if (match !== undefined || issues.length < 100) {
        return match;
      }
    }
  }

  async create(newIssue: NewIssue): Promise<number> {
    const response = await this.#request(`/repos/${this.#repository}/issues`, {
      body: JSON.stringify({
        assignees: [newIssue.assignee],
        body: newIssue.body,
        labels: newIssue.labels,
        title: newIssue.title,
      }),
      method: "POST",
    });
    return issue(await response.json()).number;
  }

  async comment(issueNumber: number, body: string): Promise<void> {
    await this.#request(
      `/repos/${this.#repository}/issues/${issueNumber}/comments`,
      { body: JSON.stringify({ body }), method: "POST" },
    );
  }
}
