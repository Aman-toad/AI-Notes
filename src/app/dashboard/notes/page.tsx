"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type NoteCard = {
  _id: string;
  title: string;
  content: string;
  updatedAt?: string;
};

export default function DashboardPage() {
  const [notes, setNotes] = useState<NoteCard[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notes", { cache: "no-store" });
      if (res.status === 401) return router.push("/login");
      if (!res.ok) throw new Error("Fetch notes failed");
      const data: NoteCard[] = await res.json();
      setNotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const truncate = (str: string, n = 120) => (str.length > n ? str.slice(0, n) + "…" : str);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Notes</h1>
        <Link
          href="/dashboard/notes/new"
          className="inline-flex h-10 items-center justify-center rounded-xl px-4 border hover:bg-gray-50"
        >
          + New
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : notes.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No notes yet.</p>
          <p className="mt-2">Click the + button to create your first note.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((n) => (
            <Link
              key={n._id}
              href={`/dashboard/notes/${n._id}`}
              className="rounded-2xl border p-4 hover:shadow transition"
            >
              <h3 className="font-semibold mb-2">{n.title || "Untitled"}</h3>
              <p className="text-sm text-gray-600">{truncate(n.content || "No content yet.")}</p>
              {n.updatedAt && (
                <p className="text-xs text-gray-400 mt-3">
                  Updated {new Date(n.updatedAt).toLocaleString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Floating + button for mobile */}
      <Link
        href="/dashboard/notes/new"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full border text-2xl leading-[46px] text-center shadow hover:bg-gray-50"
        aria-label="Create note"
      >
        +
      </Link>
    </div>
  );
}

// const { data: session, status } = useSession();
