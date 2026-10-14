import { execFileSync } from "node:child_process";
import { posix } from "node:path";

export const marketplacePath = ".claude-plugin/marketplace.json";

export function knowledgeBaseManifestPath(marketplaceContent: string): string {
  const marketplace: unknown = JSON.parse(marketplaceContent);
  if (
    typeof marketplace !== "object" ||
    marketplace === null ||
    !("plugins" in marketplace) ||
    !Array.isArray(marketplace.plugins)
  ) {
    throw new Error("The marketplace must contain a plugins array.");
  }
  const plugins: unknown[] = marketplace.plugins;
  const matches = plugins.filter(
    (plugin) =>
      typeof plugin === "object" &&
      plugin !== null &&
      "name" in plugin &&
      plugin.name === "knowledge-base",
  );
  const plugin = matches[0];
  if (
    matches.length !== 1 ||
    typeof plugin !== "object" ||
    plugin === null ||
    !("source" in plugin) ||
    typeof plugin.source !== "string" ||
    !plugin.source.startsWith("./") ||
    plugin.source.split("/").includes("..")
  ) {
    throw new Error(
      "The marketplace must select one local knowledge-base plugin.",
    );
  }
  return posix.join(plugin.source, "plugin.json");
}

export function readKnowledgeBasePluginAtRevision(
  repository: string,
  revision: string,
): { manifestPath: string; content: string } {
  const manifestPath = knowledgeBaseManifestPath(
    readFileAtRevision(repository, revision, marketplacePath),
  );
  return {
    manifestPath,
    content: readFileAtRevision(repository, revision, manifestPath),
  };
}

function git(repository: string, arguments_: string[]): string {
  return execFileSync("git", ["-C", repository, ...arguments_], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

export function readFileAtRevision(
  repository: string,
  revision: string,
  path: string,
): string {
  return git(repository, ["show", `${revision}:${path}`]);
}

export function readCommitterTimestamp(
  repository: string,
  revision: string,
): string {
  return git(repository, ["show", "-s", "--format=%cI", revision]).trim();
}

export function listChangedFiles(
  repository: string,
  baseRevision: string,
  headRevision: string,
): string[] {
  const output = git(repository, [
    "diff",
    "--name-only",
    "-z",
    `${baseRevision}...${headRevision}`,
    "--",
  ]);
  return output.split("\0").filter((path) => path.length > 0);
}
