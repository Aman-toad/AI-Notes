import { AnimatedBg } from "@/components/AnimatedBg"
import { SiteNav } from "@/components/SiteNav"
import PageTransition from "@/components/PageTransition"
import Link from "next/link"

export default function Home() {
  return (
    <main className="relative min-h-[100svh] bg-black text-white">
      <AnimatedBg />
      <SiteNav />
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-20">
          <PageTransition>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Smart notes with AI-powered tools
              </span>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight md:text-6xl">
                Meet your AI-first notes workspace
              </h1>
              <p className="mt-4 text-pretty text-white/70 md:text-lg">
                Write, organize, and supercharge your notes with live AI tools — summaries, grammar polish, and
                enhancement.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="w-full sm:w-auto rounded-md bg-cyan-500 px-5 py-3 text-center font-medium text-black transition hover:bg-cyan-400"
                >
                  Get started — it’s free
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto rounded-md px-5 py-3 text-center font-medium text-white/90 ring-1 ring-white/15 transition hover:text-white hover:ring-white/25"
                >
                  I already have an account
                </Link>
              </div>

              {/* Feature badges */}
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Notes", desc: "Organize fast" },
                  { label: "Summary", desc: "Instant TL;DR" },
                  { label: "Grammar", desc: "Polish tone" },
                  { label: "Enhancer", desc: "Make it shine" },
                ].map((f) => (
                  <div key={f.label} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left">
                    <div className="text-sm font-medium">{f.label}</div>
                    <div className="text-xs text-white/60">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </PageTransition>
        </div>
      </section>
    </main>
  )
}
