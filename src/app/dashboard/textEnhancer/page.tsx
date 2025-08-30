"use client";
import { useState } from "react";

export default function TextEnhancerPage() {
  const [text, setText] = useState("");
  const [enhance, setEnhance] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTextEnhance = async () => {
    setLoading(true);
    setEnhance("");
    try {
      const res = await fetch("/api/ai/textEnhancer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      
      setEnhance(data.EnhancedText);
    } catch (err) {
      setEnhance("Error while enhancing the text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Text Enhancer</h1>
      <textarea
        className="w-full border rounded p-3 mb-4"
        rows={6}
        placeholder="Paste text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleTextEnhance}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {loading ? "Enhancing..." : "Enhance Text"}
      </button>

      {enhance && (
        <div className="mt-4 p-4 border rounded bg-summary">
          <h2 className="font-semibold mb-2">Corrected Text:</h2>
          <p>{enhance}</p>
        </div>
      )}
    </div>
  );
}
