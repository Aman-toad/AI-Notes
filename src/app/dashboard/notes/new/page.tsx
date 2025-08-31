"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NewNotePage() {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const res = await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "", content: "" }),
          })
          if (res.status === 401) return router.replace("/login")
          if (!res.ok) throw new Error("Failed to create note")
          const note = await res.json()
          if (!cancelled) router.replace(`/dashboard/notes/${note._id}`)
        } catch (e) {
          console.error(e)
          if (!cancelled) router.replace("/dashboard") // fallback
        }
      })()

    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <main className="relative min-h-[60vh]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />
      <div className="relative z-10 p-6 max-w-3xl mx-auto">
        <p className="text-slate-300/80">Creating note…</p>
      </div>
    </main>
  )
}
