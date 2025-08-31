"use client";
import { useState } from "react";
import { aiSuggestions } from "@/config/aiSuggestions";

interface AiSuggestionsProps {
  onSelect: (id: string) => void;
}

export default function AiSuggestions({ onSelect }: AiSuggestionsProps) {
  const [hidden, setHidden] = useState<string[]>([]);

  const handleRemove = (id: string) => {
    setHidden(prev => [...prev, id]);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {aiSuggestions
        .filter(s => !hidden.includes(s.id))
        .map(s => (
          <div
            key={s.id}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-xl shadow cursor-pointer hover:bg-slate-800 text-white"
            onClick={() => onSelect(s.id)}
          >
            <span>{s.icon}</span>
            <span className="font-medium">{s.label}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(s.id);
              }}
              className="ml-2 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
    </div>
  );
}
