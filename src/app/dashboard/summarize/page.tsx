"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Clipboard, ClipboardCheck, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SummarizerPage() {
  const router = useRouter()
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSummarize = async () => {
    setLoading(true)
    setSummary("")
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      setSummary(data.summary || "No summary generated.")
    } catch {
      setSummary("Error while summarizing.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!summary) return
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const words = text.trim().length ? text.trim().split(/\s+/).length : 0

  return (
    <main className="relative min-h-[calc(100dvh-0px)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />
      <div className="relative z-10 p-6 max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="text-slate-200 hover:bg-white/5"
          onClick={() => router.back()}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-white mb-4">Text Summarizer</h1>

        <Card className="rounded-2xl border-white/10 bg-white/5 backdrop-blur-md p-4 space-y-3">
          <Textarea
            className="w-full min-h-48 bg-transparent border-white/10 text-slate-100 placeholder:text-slate-400"
            rows={8}
            placeholder="Paste text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Words: {words}</span>
            <Button
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? "Summarizing..." : "Summarize"}
            </Button>
          </div>
        </Card>

        {summary && (
          <Card className="mt-4 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-white">Summary</h2>
              <Button variant="secondary" className="bg-white/10 text-slate-200 hover:bg-white/20" onClick={handleCopy}>
                {copied ? (
                  <>
                    <ClipboardCheck className="h-4 w-4 mr-2" /> Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="h-4 w-4 mr-2" /> Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-slate-200">{summary}</p>
          </Card>
        )}
      </div>
    </main>
  )
}
