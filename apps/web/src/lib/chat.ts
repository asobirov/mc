export type ChatMessage = {
  authorName: string;
  body: string;
  createdAt: number;
  id: number;
  source: "game" | "web";
};

export type ChatResponse = {
  bridgeEnabled: boolean;
  messages: ChatMessage[];
};
