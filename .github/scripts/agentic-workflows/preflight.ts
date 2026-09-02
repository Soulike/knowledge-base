import { requireReasoningEffort } from "./reasoning-effort.ts";

const effort = requireReasoningEffort(process.env.AGENTIC_REASONING_EFFORT);
process.stdout.write(`Using configured reasoning effort '${effort}'.\n`);
