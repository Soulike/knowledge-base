import { runCommand, type Marketplace, type RunCommand } from "./shared.mts";

type CodexPluginList = {
  installed?: Array<{
    installed?: boolean;
    marketplaceName?: string;
    name?: string;
  }>;
};

export function installWithCodex(
  repository: string,
  marketplace: Marketplace,
  run: RunCommand = runCommand,
): void {
  run("codex", ["--version"]);
  run("codex", ["plugin", "marketplace", "add", repository, "--json"]);
  run("codex", [
    "plugin",
    "list",
    "--marketplace",
    marketplace.name,
    "--available",
    "--json",
  ]);

  for (const plugin of marketplace.plugins) {
    run("codex", [
      "plugin",
      "add",
      `${plugin.name}@${marketplace.name}`,
      "--json",
    ]);
  }

  const pluginList = JSON.parse(
    run("codex", [
      "plugin",
      "list",
      "--marketplace",
      marketplace.name,
      "--json",
    ]),
  ) as CodexPluginList;

  for (const plugin of marketplace.plugins) {
    const isInstalled = pluginList.installed?.some(
      (installed) =>
        installed.name === plugin.name &&
        installed.marketplaceName === marketplace.name &&
        installed.installed === true,
    );
    if (!isInstalled) {
      throw new Error(
        `Codex did not list ${plugin.name}@${marketplace.name} as installed.`,
      );
    }
  }
}
