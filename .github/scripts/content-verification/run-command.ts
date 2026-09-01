import { spawn } from "node:child_process";

export type CapturedCommand = {
  exitCode: number | null;
  stdout: string;
};

export async function captureCommand(
  commandName: string,
  arguments_: string[],
  workingDirectory?: string,
  trim = true,
): Promise<CapturedCommand> {
  return await new Promise((resolvePromise, reject) => {
    const child = spawn(commandName, arguments_, {
      cwd: workingDirectory,
      env: process.env,
      stdio: ["ignore", "pipe", "inherit"],
    });
    let stdout = "";
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.on("error", reject);
    child.on("close", (exitCode) => {
      resolvePromise({
        exitCode,
        stdout: trim ? stdout.trim() : stdout,
      });
    });
  });
}

export async function command(
  commandName: string,
  arguments_: string[],
  workingDirectory?: string,
  trim = true,
): Promise<string> {
  const result = await captureCommand(
    commandName,
    arguments_,
    workingDirectory,
    trim,
  );
  if (result.exitCode !== 0) {
    throw new Error(
      `${commandName} exited with status ${result.exitCode ?? "unknown"}.`,
    );
  }
  return result.stdout;
}
