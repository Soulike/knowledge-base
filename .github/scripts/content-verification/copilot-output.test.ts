import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  extractCopilotFinalAnswer,
  formatCopilotDiagnostics,
  summarizeCopilotEventTypes,
} from "./copilot-output.ts";

function jsonLines(...events: unknown[]): string {
  return events.map((event) => JSON.stringify(event)).join("\n");
}

const finalAnswer = '{"revision":"abc","scope":"example","units":[]}';

describe("extractCopilotFinalAnswer", () => {
  it("selects the final answer without treating commentary as the result", () => {
    const source = jsonLines(
      {
        type: "assistant.message",
        data: {
          content: "I'll start by inspecting the targets.",
          phase: "commentary",
          toolRequests: [{ name: "view" }],
        },
      },
      { type: "tool.execution_complete", data: { success: true } },
      {
        type: "assistant.message",
        data: {
          content: finalAnswer,
          phase: "final_answer",
          toolRequests: [],
        },
      },
      { type: "model.response", data: {} },
      { type: "model.turn_ended", data: {} },
      { type: "assistant.turn_end", data: { turnId: "1" } },
      { type: "model.messages_snapshot", data: {} },
      { type: "session.usage_checkpoint", data: {} },
      { type: "assistant.idle", data: {} },
      { type: "result", exitCode: 0 },
    );

    assert.equal(extractCopilotFinalAnswer(source), finalAnswer);
  });

  it("rejects malformed JSONL instead of searching free text for JSON", () => {
    assert.throws(
      () => extractCopilotFinalAnswer(`I'll start.\n${finalAnswer}`),
      /line 1 is not valid JSON/u,
    );
  });

  it("requires exactly one final answer", () => {
    const finalEvent = {
      type: "assistant.message",
      data: { content: finalAnswer, phase: "final_answer", toolRequests: [] },
    };

    assert.throws(
      () =>
        extractCopilotFinalAnswer(
          jsonLines(
            { type: "assistant.message", data: { phase: "commentary" } },
            { type: "result", exitCode: 0 },
          ),
        ),
      /exactly one final answer/u,
    );
    assert.throws(
      () =>
        extractCopilotFinalAnswer(
          jsonLines(finalEvent, finalEvent, { type: "result", exitCode: 0 }),
        ),
      /exactly one final answer/u,
    );
  });

  it("requires one successful terminal result after the final answer", () => {
    const finalEvent = {
      type: "assistant.message",
      data: { content: finalAnswer, phase: "final_answer", toolRequests: [] },
    };

    assert.throws(
      () => extractCopilotFinalAnswer(jsonLines(finalEvent)),
      /exactly one result event/u,
    );
    assert.throws(
      () =>
        extractCopilotFinalAnswer(
          jsonLines(finalEvent, { type: "result", exitCode: 1 }),
        ),
      /successful result event/u,
    );
    assert.throws(
      () =>
        extractCopilotFinalAnswer(
          jsonLines({ type: "result", exitCode: 0 }, finalEvent),
        ),
      /after the final answer/u,
    );
    assert.throws(
      () =>
        extractCopilotFinalAnswer(
          jsonLines(
            finalEvent,
            { type: "result", exitCode: 0 },
            { type: "session.error", data: {} },
          ),
        ),
      /result event must be terminal/u,
    );
  });

  it("rejects Agent or tool activity after the final answer", () => {
    const finalEvent = {
      type: "assistant.message",
      data: { content: finalAnswer, phase: "final_answer", toolRequests: [] },
    };

    for (const event of [
      {
        type: "assistant.message",
        data: { content: "Continuing.", phase: "commentary", toolRequests: [] },
      },
      { type: "tool.execution_complete", data: { success: false } },
    ]) {
      assert.throws(
        () =>
          extractCopilotFinalAnswer(
            jsonLines(finalEvent, event, { type: "result", exitCode: 0 }),
          ),
        /unsupported activity after the final answer/u,
      );
    }
  });
});

describe("summarizeCopilotEventTypes", () => {
  it("returns bounded event shapes without retaining event content", () => {
    const summary = summarizeCopilotEventTypes(
      [
        JSON.stringify({
          type: "assistant.message",
          data: { content: "sensitive content", phase: "commentary" },
        }),
        JSON.stringify({
          type: "assistant.message",
          data: { content: finalAnswer, phase: "final_answer" },
        }),
        "not-json",
        JSON.stringify({ type: "result", exitCode: 0 }),
      ].join("\n"),
      3,
    );

    assert.deepEqual(summary, [
      "assistant.message:commentary",
      "assistant.message:final_answer",
      "<invalid-json>",
      "<truncated>",
    ]);
    assert.equal(summary.join(" ").includes("sensitive content"), false);
  });
});

describe("formatCopilotDiagnostics", () => {
  it("records bounded runtime provenance without the raw transcript", () => {
    const message = formatCopilotDiagnostics({
      copilotVersion: "GitHub Copilot CLI 1.0.81-0.\nUpdate available.",
      model: "grok-4.6",
      observedEventTypes: [
        "assistant.message:commentary",
        "assistant.message:final_answer",
        "result",
      ],
      reasoningEffort: "xhigh",
      skillsVersion: "1.2.3",
    });

    assert.match(
      message,
      /Copilot CLI: GitHub Copilot CLI 1\.0\.81-0\. Update available\./u,
    );
    assert.match(message, /Skills CLI: 1\.2\.3/u);
    assert.match(message, /Model: grok-4\.6/u);
    assert.match(message, /Reasoning effort: xhigh/u);
    assert.match(
      message,
      /Event types: assistant\.message:commentary, assistant\.message:final_answer, result/u,
    );
    assert.equal(message.includes(finalAnswer), false);
  });
});
