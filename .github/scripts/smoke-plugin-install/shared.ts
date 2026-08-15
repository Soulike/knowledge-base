import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Marketplace = {
  name: string;
  plugins: Array<{ name: string }>;
};

export type RunCommand = (command: string, args: string[]) => string;

export class CommandError extends Error {
  readonly exitCode: number;

  constructor(message: string, exitCode: number) {
    super(message);
    this.exitCode = exitCode;
  }
}

export const runCommand: RunCommand = (command, args) => {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "inherit"],
  });
  const stdout = result.stdout ?? "";

  process.stdout.write(stdout);
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new CommandError(
      `${command} ${args.join(" ")} exited with status ${result.status}.`,
      result.status ?? 1,
    );
  }

  return stdout;
};

export function readMarketplace(repository: string): Marketplace {
  const marketplaceFile = join(
    repository,
    ".claude-plugin",
    "marketplace.json",
  );
  return JSON.parse(readFileSync(marketplaceFile, "utf8")) as Marketplace;
}
