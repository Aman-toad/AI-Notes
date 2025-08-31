//note display page

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileText, Plus } from "lucide-react"

type NoteCard = {
  _id: string
  title: string
  content: string
  updatedAt?: string
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<NoteCard[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/notes", { cache: "no-store" })
      if (res.status === 401) return router.push("/login")
      if (!res.ok) throw new Error("Fetch notes failed")
      const data: NoteCard[] = await res.json()
      setNotes(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const truncate = (str: string, n = 120) => (str.length > n ? str.slice(0, n) + "…" : str)

  return (
    <main className="relative min-h-[calc(100dvh-0px)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            className="text-slate-200 hover:bg-white/5"
            onClick={() => router.back()}
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-white">Your Notes</h1>
          
          <Link href="/dashboard/notes/new">
            <Button className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400">
              <Plus className="h-4 w-4 mr-2" /> New
            </Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-300/80">Loading…</p>
        ) : notes.length === 0 ? (
          <Card className="rounded-2xl border-white/10 bg-white/5 backdrop-blur-md p-10 text-center">
            <FileText className="h-8 w-8 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-300/80">No notes yet.</p>
            <p className="text-slate-400 text-sm mt-1">Click New to create your first note.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((n) => (
              <Link
                key={n._id}
                href={`/dashboard/notes/${n._id}`}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 hover:bg-white/10 transition"
              >
                <h3 className="font-semibold text-white mb-2">{n.title || "Untitled"}</h3>
                <p className="text-sm text-slate-300/80">{truncate(n.content || "No content yet.")}</p>
                {n.updatedAt && (
                  <p className="text-xs text-slate-400 mt-3">Updated {new Date(n.updatedAt).toLocaleString()}</p>
                )}
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/dashboard/notes/new"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full border border-white/20 bg-cyan-500 text-black text-2xl leading-[46px] text-center shadow hover:bg-cyan-400"
          aria-label="Create note"
        >
          +
        </Link>
      </div>
    </main>
  )
}

// const { data: session, status } = useSession();
