"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import AiSuggestions from "@/components/AiSuggestions";

type NoteDoc = {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function NoteEcitorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  // ai suggestions
  const [note, setNote] = useState<NoteDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleAiAction = async (id: string) => {
    if (!note && id !== "idea") {
      alert("Please write something first!");
      return;
    }
    setMessage("");
    setLoading(true);

    try {
      let endpoint = "";
      switch (id) {
        case "summarize": endpoint = "/api/ai/summarize"; break;
        case "grammar": endpoint = "/api/ai/grammar"; break;
        case "enhance": endpoint = "/api/ai/textEnhancer"; break;
        case "idea": endpoint = "/api/ai/ideaGeneration"; break;
        default: return;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to Fetch AI Result");

      if (id === "idea") {
        setContent(prev => prev + "\n\n" + data.generatedIdea + "\n\n" + "Which one are you using ??")
      }
      else if (id === "grammar") {
        setContent(prev => prev + "\n\n" + data.grammarizedText)
      } else if (id === "summarize") {
        setContent(prev => prev + "\n\n" + data.summary)
      } else {
        setContent(prev => prev + "\n\n" + data.EnhancedText)
      }
    } catch (err) {
      console.error(err);
      alert("something went wrong");
    } finally {
      setLoading(false)
    }
  }

  //fetch note
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/notes/${id}`, { cache: "no-store" });
        if (res.status === 401) return router.replace("/login");
        if (res.status === 404) return router.replace("/dashboard");
        if (!res.ok) throw new Error("Failed to fetch note");
        const data: NoteDoc = await res.json();
        if (!cancelled) {
          setNote(data);
          setTitle(data.title ?? "");
          setContent(data.content ?? "");
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  // debounce autosave
  const debounceMs = 600;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const payload = useMemo(() => ({ title, content }), [title, content]);

  useEffect(() => {
    if (!note) return;
    setStatus("saving");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/notes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Autosave failed");
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 800);
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, note, payload]);

  // deletion
  const handleDelete = async () => {
    if (!confirm("Delete this note ?")) return;
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete Failed");
      router.push("/dashboard/notes");
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="rounded-xl border px-3 py-1 hover:bg-gray-50"
          aria-label="Back"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3 text-sm">
          {status === "saving" && <span className="text-gray-500">Saving…</span>}
          {status === "saved" && <span className="text-green-600">Saved</span>}
          {status === "error" && <span className="text-red-600">Save failed</span>}
          <button
            onClick={handleDelete}
            className="rounded-xl border px-3 py-1 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <input
        className="w-full text-2xl font-semibold outline-none placeholder:text-gray-400"
        placeholder="Untitled"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full min-h-[60vh] resize-none outline-none placeholder:text-gray-400"
        placeholder="Start writing…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {message && (
        <p className="text-red-500 text-sm mb-3">{message}</p>
      )}

      {/* aisuggestions */}
      {content && (
        <div>
          <p>Let AI help You !!</p>
          <AiSuggestions onSelect={handleAiAction} />
        </div>
      )}

      {/* idea Generation */}
      {!content && (
        <div>
          <p>Don't have any Idea, Let AI help you !!</p>
          <div
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-xl shadow cursor-pointer hover:bg-slate-800"
            onClick={() => handleAiAction("idea")}
          >
            <span>💡</span>
            <span className="font-medium">Generate Idea</span>
          </div>
        </div>
      )}

      {loading && (
        <p className="mt-2 text-gray-500">Processing...</p>
      )}
    </div>
  );
}