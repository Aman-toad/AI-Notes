"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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

  const [note, setNote] = useState<NoteDoc | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
    </div>
  );
}