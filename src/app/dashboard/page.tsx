"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, Sparkles, SpellCheck, Highlighter, ChevronRight, User } from "lucide-react"
import { useSession } from "next-auth/react"

type UserInfo = { name?: string; email?: string }
type NoteCard = { _id: string; title: string; content: string; updatedAt?: string }

function FeatureCard({
  title,
  desc,
  icon,
  href,
  accent,
}: {
  title: string
  desc: string
  icon: React.ReactNode
  href: string
  accent: "cyan" | "emerald"
}) {
  const ring =
    accent === "cyan"
      ? "bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 ring-1 ring-cyan-500/30"
      : "bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 ring-1 ring-emerald-500/30"

  return (
    <Link href={href} className="group focus:outline-none">
      <div
        className={`rounded-2xl p-4 md:p-5 ${ring} backdrop-blur-md transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-black/40 grid place-items-center">{icon}</div>
            <div>
              <h3 className="font-semibold text-white text-pretty">{title}</h3>
              <p className="text-sm text-slate-300/80">{desc}</p>
            </div>
          </div>
          <ChevronRight className="h-8 w-8 text-slate-300/70 opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition" />
        </div>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const {data: session, status} = useSession();
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [notes, setNotes] = useState<NoteCard[]>([])
  const [loadingNotes, setLoadingNotes] = useState(true)
  
  // fetching userData
  useEffect(()=> {
    if(session?.user){
      setUser({
        name: session.user.name ?? undefined,
        email: session.user.email ?? undefined,
      })
    } else {
      setUser(null)
    }
  },[session]);

  useEffect(() => {
    let isCancelled = false; 
    (async () => {
        try {
          setLoadingNotes(true)
          const res = await fetch("/api/notes", { cache: "no-store" })
          if (res.status === 401) return router.push("/login")
          if (!res.ok) throw new Error("Fetch notes failed")
          const data: NoteCard[] = await res.json()
          if (!isCancelled) setNotes(data)
        } catch (e) {
          console.error(e)
        } finally {
          if (!isCancelled) setLoadingNotes(false)
        }
      })()
    return () => {
      isCancelled = true
    }
  }, [router]);
  
  const recent = useMemo(() => notes.slice(0, 3), [notes])

  if(status === "loading") return <p className="text-white text-center ">Loading User Data ...</p>;
  if(!session) return <p>Not signed in</p>;

  return (
    <main className="relative min-h-[calc(100dvh-0px)]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)] bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.12),transparent_60%)]" />

      <section className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:py-10">
        <header className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white text-balance">Your AI Notes Hub</h1>
            <p className="text-slate-300/80 mt-1">Fast notes with powerful AI tools.</p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/notes/new")}
            className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400"
          >
            New Note
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: Feature grid */}
          <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
            <FeatureCard
              title="Notes"
              desc="Create and organize your ideas"
              icon={<FileText className="h-8 w-8 text-cyan-300" aria-hidden />}
              href="/dashboard/notes"
              accent="cyan"
            />
            <FeatureCard
              title="Summary"
              desc="Condense long text quickly"
              icon={<Sparkles className="h-8 w-8 text-cyan-300" aria-hidden />}
              href="/dashboard/summarize"
              accent="cyan"
            />
            <FeatureCard
              title="Grammar"
              desc="Fix mistakes and polish"
              icon={<SpellCheck className="h-8 w-8 text-emerald-300" aria-hidden />}
              href="/dashboard/grammar"
              accent="emerald"
            />
            <FeatureCard
              title="Text Enhancer"
              desc="Rewrite with clarity and style"
              icon={<Highlighter className="h-8 w-8 text-emerald-300" aria-hidden />}
              href="/dashboard/textEnhancer"
              accent="emerald"
            />
          </div>

          {/* Right: User + Recents */}
          <div className="space-y-4">
            <Card className="rounded-2xl border-white/10 bg-white/5 backdrop-blur-md p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-cyan-500/20 text-cyan-300">
                    {user?.name?.[0]?.toUpperCase() || <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-slate-300/80">Signed in</p>
                  <p className="font-medium text-white">{user?.name || "Guest"}</p>
                  <p className="text-xs text-slate-400">{user?.email || "you@example.com"}</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-white/10 bg-white/5 backdrop-blur-md p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Recent Notes</h3>
                <Link href="/dashboard/notes" className="text-sm text-cyan-300 hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-3 space-y-2">
                {loadingNotes ? (
                  <div className="space-y-2">
                    <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                  </div>
                ) : recent.length === 0 ? (
                  <p className="text-sm text-slate-300/80">No notes yet. Create your first one!</p>
                ) : (
                  recent.map((n) => (
                    <Link
                      key={n._id}
                      href={`/dashboard/notes/${n._id}`}
                      className="block rounded-lg px-2 py-2 hover:bg-white/5"
                    >
                      <p className="text-sm text-white">{n.title || "Untitled"}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{n.content || "No content yet."}</p>
                    </Link>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
