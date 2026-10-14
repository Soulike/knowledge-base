import type {
  FindingIssue,
  FindingIssueRepository,
} from "./finding-publication.ts";

type JsonObject = Record<string, unknown>;

function fail(message: string): never {
  throw new Error(`GitHub issue adapter: ${message}`);
}

function object(value: unknown, description: string): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(`${description} must be an object.`);
  }
  return value as JsonObject;
}

function array(value: unknown, description: string): unknown[] {
  if (!Array.isArray(value)) {
    fail(`${description} must be an array.`);
  }
  return value;
}

function string(value: unknown, description: string): string {
  if (typeof value !== "string") {
    fail(`${description} must be a string.`);
  }
  return value;
}

function nullableString(value: unknown, description: string): string {
  if (value === null) {
    return "";
  }
  return string(value, description);
}

function positiveInteger(value: unknown, description: string): string {
  if (!Number.isSafeInteger(value) || Number(value) <= 0) {
    fail(`${description} must be a positive safe integer.`);
  }
  return String(value);
}

function issue(value: unknown): FindingIssue {
  const response = object(value, "issue response");
  const number = positiveInteger(response.number, "issue number");
  if (response.state !== "open" && response.state !== "closed") {
    fail(`issue #${number} has unsupported state.`);
  }
  const user =
    response.user === null ? undefined : object(response.user, "issue user");
  const labels = array(response.labels, "issue labels").map((label) => {
    if (typeof label === "string") {
      return label;
    }
    return string(object(label, "issue label").name, "issue label name");
  });
  if (new Set(labels).size !== labels.length) {
    fail(`issue #${number} contains duplicate labels.`);
  }
  return {
    authorLogin:
      user === undefined ? "" : string(user.login, "issue author login"),
    body: nullableString(response.body, "issue body"),
    labels,
    number,
    pullRequest: Object.hasOwn(response, "pull_request"),
    state: response.state,
    title: string(response.title, "issue title"),
  };
}

export class GitHubIssueRepository implements FindingIssueRepository {
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

  async #request(path: string, init?: RequestInit): Promise<unknown> {
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
    return (await response.json()) as unknown;
  }

  async createIssue(input: {
    assignees: string[];
    body: string;
    labels: string[];
    title: string;
  }): Promise<FindingIssue> {
    const response = await this.#request(
      `/repos/${encodeURIComponent(this.#owner)}/${encodeURIComponent(this.#repo)}/issues`,
      {
        body: JSON.stringify(input),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    );
    return issue(response);
  }

  async listOpenIssues(labels: string[]): Promise<FindingIssue[]> {
    const issues: FindingIssue[] = [];
    const perPage = 100;
    for (let page = 1; ; page += 1) {
      const query = new URLSearchParams({
        labels: labels.join(","),
        page: String(page),
        per_page: String(perPage),
        state: "open",
      });
      const pageIssues = array(
        await this.#request(
          `/repos/${encodeURIComponent(this.#owner)}/${encodeURIComponent(this.#repo)}/issues?${query.toString()}`,
        ),
        "issue list",
      );
      issues.push(...pageIssues.map(issue));
      if (pageIssues.length < perPage) {
        return issues;
      }
    }
  }
}
