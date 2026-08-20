import { constants } from "node:fs";
import { open } from "node:fs/promises";
import { join } from "node:path";

export const reviewVerdictFile = "verdict.txt";

export type ReviewVerdict = "approved" | "needs-change";

export async function writeReviewVerdict(
  directory: string,
  verdict: ReviewVerdict,
): Promise<void> {
  const handle = await open(
    join(directory, reviewVerdictFile),
    constants.O_CREAT |
      constants.O_EXCL |
      constants.O_WRONLY |
      constants.O_NOFOLLOW,
    0o600,
  );
  try {
    await handle.writeFile(`${verdict}\n`);
  } finally {
    await handle.close();
  }
}

export async function readReviewVerdict(
  directory: string,
): Promise<ReviewVerdict> {
  const path = join(directory, reviewVerdictFile);
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > 64) {
      throw new Error(`${path} is not a valid review verdict file.`);
    }
    const source = await handle.readFile("utf8");
    if (source === "approved\n") {
      return "approved";
    }
    if (source === "needs-change\n") {
      return "needs-change";
    }
    throw new Error(`${path} contains an invalid review verdict.`);
  } finally {
    await handle.close();
  }
}
