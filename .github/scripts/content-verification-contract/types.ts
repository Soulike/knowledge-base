import type { KnowledgeType } from "@knowledge-base/knowledge-catalog-validation";

export type MaintainedAgentContentTarget = {
  files: string[];
  id: string;
  kind: "agent-content" | "shared-reference" | "skill";
};

export type KnowledgeVerificationTarget = {
  files: string[];
  id: string;
  kind: "knowledge";
  knowledgeType: KnowledgeType;
};

export type VerificationTarget =
  KnowledgeVerificationTarget | MaintainedAgentContentTarget;
