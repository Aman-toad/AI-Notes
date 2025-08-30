export interface AiSuggestion {
  id: string;
  label: string;
  description: string;
  icon?: string; // optional, for UI
}

export const aiSuggestions: AiSuggestion[] = [
  {
    id: "idea",
    label: "Idea Generator",
    description: "Generate fresh ideas to start your note.",
    icon: "💡"
  },
  {
    id: "grammar",
    label: "Check Grammar",
    description: "Fix grammar issues instantly.",
    icon: "📝"
  },
  {
    id: "summarize",
    label: "Summarize Note",
    description: "Get a concise summary of your note.",
    icon: "📄"
  },
  {
    id: "enhance",
    label: "Enhance Text",
    description: "Improve clarity and word choice.",
    icon: "✨"
  }
];
