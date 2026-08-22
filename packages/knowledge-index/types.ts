export type KnowledgeType = "time-sensitive" | "evergreen";

export interface KnowledgeIndexEntry {
  filePath: string;
  knowledgeType: KnowledgeType;
  whenToRead: string;
}
