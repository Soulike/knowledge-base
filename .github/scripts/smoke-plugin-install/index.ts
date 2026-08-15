import { realpathSync } from "node:fs";

import { installWithCodex } from "./codex.ts";
import { installWithCopilot } from "./copilot.ts";
import { CommandError, readMarketplace } from "./shared.ts";

function main(): void {
  const client = process.argv[2];
  if (client !== "codex" && client !== "copilot") {
    console.error(`Usage: ${process.argv[1]} codex|copilot`);
    process.exitCode = 2;
    return;
  }

  const repository = realpathSync(process.cwd());
  const marketplace = readMarketplace(repository);

  if (client === "codex") {
    installWithCodex(repository, marketplace);
  } else {
    installWithCopilot(repository, marketplace);
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = error instanceof CommandError ? error.exitCode : 1;
}
