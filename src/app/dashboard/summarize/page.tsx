"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SummarizerPage() {
  const params = useSearchParams();
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const text = params.get("text");
    if (text) setInput(text);
  }, [params]);

  async function handleSummarize(value: string) {
    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      body: JSON.stringify({ text: value }),
    });
    const data = await res.json();
    setSummary(data.summary);
  }

  useEffect(() => {
    if (input.trim()) {
      const timeout = setTimeout(() => handleSummarize(input), 800);
      return () => clearTimeout(timeout);
    }
  }, [input]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Summarizer</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border p-2 mb-4"
        placeholder="Paste or type your text here..."
        rows={6}
      />
      {summary && (
        <div className="border p-4 bg-gray-100">
          <h2 className="font-semibold mb-2">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
