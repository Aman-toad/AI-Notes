"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import AiSuggestions from "@/components/AiSuggestions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Undo2, Trash2 } from "lucide-react"

type NoteDoc = {
  _id: string
  title: string
  content: string
  createdAt?: string
  updatedAt?: string
}

export default function NoteEcitorPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [note, setNote] = useState<NoteDoc | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [message, setMessage] = useState("")

  const [history, setHistory] = useState<string[]>([])

  const handleAiAction = async (actionId: string) => {
    if (!note && actionId !== "idea") {
      alert("Please write something first!")
      return
    }
    setMessage("")
    setLoading(true)

    try {
      let endpoint = ""
      switch (actionId) {
        case "summarize":
          endpoint = "/api/ai/summarize"
          break
        case "grammar":
          endpoint = "/api/ai/grammar"
          break
        case "enhance":
          endpoint = "/api/ai/textEnhancer"
          break
        case "idea":
          endpoint = "/api/ai/ideaGeneration"
          break
        default:
          return
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to Fetch AI Result")

      if (actionId === "idea") {
        setContent((prev) => prev + "\n\n" + data.generatedIdea + "\n\n" + "Which one are you using ??")
      } else if (actionId === "grammar") {
        setContent((prev) => prev + "\n\n" + data.grammarizedText)
      } else if (actionId === "summarize") {
        setContent((prev) => prev + "\n\n" + data.summary)
      } else {
        setContent((prev) => prev + "\n\n" + data.EnhancedText)
      }
    } catch (err) {
      console.error(err)
      alert("something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const updateNote = (newContent: string) => {
    setHistory((prev) => [...prev, content])
    setContent(newContent)
  }

  const handleUndo = () => {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setContent(last)
    setHistory((prev) => prev.slice(0, -1))
  }

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const res = await fetch(`/api/notes/${id}`, { cache: "no-store" })
          if (res.status === 401) return router.replace("/login")
          if (res.status === 404) return router.replace("/dashboard")
          if (!res.ok) throw new Error("Failed to fetch note")
          const data: NoteDoc = await res.json()
          if (!cancelled) {
            setNote(data)
            setTitle(data.title ?? "")
            setContent(data.content ?? "")
          }
        } catch (e) {
          console.error(e)
        }
      })()
    return () => {
      cancelled = true
    }
  }, [id, router])

  const debounceMs = 600
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const payload = useMemo(() => ({ title, content }), [title, content])

  useEffect(() => {
    if (!note) return
    setStatus("saving")

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/notes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Autosave failed")
        setStatus("saved")
        setTimeout(() => setStatus("idle"), 800)
      } catch (e) {
        console.error(e)
        setStatus("error")
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [id, note, payload])

  const handleDelete = async () => {
    if (!confirm("Delete this note ?")) return
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete Failed")
      router.push("/dashboard/notes")
    } catch (err) {
      console.error(err)
      alert("Failed to delete note")
    }
  }

  const words = content.trim().length ? content.trim().split(/\s+/).length : 0

  return (
    <main className="relative min-h-[calc(100dvh-0px)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />
      <div className="relative z-10 px-4 py-6 mx-auto max-w-4xl space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-slate-200 hover:bg-white/5"
            onClick={() => router.back()}
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="rounded-xl bg-white/10 text-slate-200 hover:bg-white/20 disabled:opacity-50"
              onClick={handleUndo}
              disabled={history.length === 0}
            >
              <Undo2 className="h-4 w-4 mr-2" />
              Undo
            </Button>
            <Button
              variant="secondary"
              className="rounded-xl bg-white/10 text-slate-200 hover:bg-white/20"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <span
              className={
                status === "saving"
                  ? "text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-200"
                  : status === "saved"
                    ? "text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-200"
                    : status === "error"
                      ? "text-xs px-2 py-1 rounded-full bg-white/10 text-slate-200"
                      : "text-xs text-slate-300/80"
              }
            >
              {status === "saving" && "Saving…"}
              {status === "saved" && "Saved"}
              {status === "error" && "Save failed"}
              {status === "idle" && ""}
            </span>
          </div>
        </div>

        {/* Editor Card */}
        <Card className="rounded-2xl border-white/10 bg-white/5 backdrop-blur-md p-4 md:p-5 space-y-3">
          <Input
            className="w-full text-xl md:text-2xl font-semibold bg-transparent border-white/10 text-white placeholder:text-slate-400"
            placeholder="Untitled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            className="min-h-[60vh] w-full resize-none bg-transparent border-white/10 text-slate-100 placeholder:text-slate-400"
            placeholder="Start writing…"
            value={content}
            onChange={(e) => updateNote(e.target.value)}
          />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Words: {words}</span>
            {loading && <span className="animate-pulse">AI is thinking…</span>}
          </div>
        </Card>

        {message && <p className="text-cyan-200 text-sm">{message}</p>}

        {/* AI helpers */}
        {content ? (
          <div>
            <p className="text-slate-300/80 mb-2">Let AI help you</p>
            <AiSuggestions onSelect={handleAiAction} />
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-slate-300/80">Don&apos;t have any idea? Let AI help you.</p>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400"
              onClick={() => handleAiAction("idea")}
            >
              💡 <span className="font-medium">Generate Idea</span>
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
