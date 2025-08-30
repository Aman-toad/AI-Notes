"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewNotePage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "", content: "" }),
        });
        if (res.status === 401) return router.replace("/login");
        if (!res.ok) throw new Error("Failed to create note");
        const note = await res.json();
        if (!cancelled) router.replace(`/dashboard/notes/${note._id}`);
      } catch (e) {
        console.error(e);
        if (!cancelled) router.replace("/dashboard"); // fallback
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-gray-500">Creating note…</p>
    </div>
  );
}
