import { spawn } from "node:child_process";

export async function runCommand(
  commandName: string,
  arguments_: string[],
): Promise<void> {
  return await new Promise((resolve, reject) => {
    const child = spawn(commandName, arguments_, {
      env: process.env,
      stdio: ["ignore", "inherit", "inherit"],
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `${commandName} ${arguments_.join(" ")} exited with status ${code ?? "unknown"}.`,
          ),
        );
        return;
      }
      resolve();
    });
  });
}
