import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";

export const compilerVersion = "v1.0.1";
export const runtimeActionSha = "0627fdbe4beb5f3b71aa569f8d97150b87f2111a";

const compileArguments = [
  "compile",
  "--action-mode",
  "release",
  "--action-tag",
  runtimeActionSha,
  "--validate",
  "--no-check-update",
] as const;

export type CompilerInvocation = {
  args: string[];
  command: string;
  versionArgs: string[];
};

export function compilerInvocation(
  environment: NodeJS.ProcessEnv,
): CompilerInvocation {
  const standaloneCompiler = environment.GH_AW_COMPILER?.trim();
  if (standaloneCompiler) {
    return {
      args: [...compileArguments],
      command: standaloneCompiler,
      versionArgs: ["--version"],
    };
  }
  return {
    args: ["aw", ...compileArguments],
    command: "gh",
    versionArgs: ["aw", "--version"],
  };
}

export function requireCompilerVersion(output: string): string {
  const found = /\b(v[0-9]+\.[0-9]+\.[0-9]+)\b/u.exec(output)?.[1];
  if (found !== compilerVersion) {
    throw new Error(
      `Expected gh-aw compiler ${compilerVersion}, received ${found ?? "an unknown version"}.`,
    );
  }
  return found;
}

export function assertNoGeneratedDrift(status: string): void {
  const normalized = status.trim();
  if (normalized.length > 0) {
    throw new Error(
      `Generated Agentic workflow artifacts are stale:\n${normalized}`,
    );
  }
}

const executeFile = promisify(execFile);

export async function compileAgenticWorkflows(
  environment: NodeJS.ProcessEnv = process.env,
): Promise<void> {
  const invocation = compilerInvocation(environment);
  const version = await executeFile(
    invocation.command,
    invocation.versionArgs,
    {
      env: environment,
    },
  );
  requireCompilerVersion(`${version.stdout}\n${version.stderr}`);

  await new Promise<void>((resolve, reject) => {
    const child = spawn(invocation.command, invocation.args, {
      env: environment,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `gh-aw compilation failed with ${signal ? `signal ${signal}` : `exit code ${String(code)}`}.`,
        ),
      );
    });
  });
}
