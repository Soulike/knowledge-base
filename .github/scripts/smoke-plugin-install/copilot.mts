import { runCommand, type Marketplace, type RunCommand } from "./shared.mts";

export function installWithCopilot(
  repository: string,
  marketplace: Marketplace,
  run: RunCommand = runCommand,
): void {
  run("copilot", ["--version"]);
  run("copilot", ["plugin", "marketplace", "add", repository]);
  run("copilot", ["plugin", "marketplace", "browse", marketplace.name]);

  for (const plugin of marketplace.plugins) {
    run("copilot", ["plugin", "install", `${plugin.name}@${marketplace.name}`]);
  }

  const installedPlugins = run("copilot", ["plugin", "list"]);
  for (const plugin of marketplace.plugins) {
    const selector = `${plugin.name}@${marketplace.name}`;
    if (!installedPlugins.includes(selector)) {
      throw new Error(`Copilot did not list ${selector} as installed.`);
    }
  }
}
