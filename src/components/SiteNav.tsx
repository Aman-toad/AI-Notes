"use client"
import Link from "next/link"

export function SiteNav() {
  return (
    <header className="relative z-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-cyan-500/20 ring-1 ring-cyan-400/30 flex items-center justify-center">
            <span className="text-cyan-300 text-sm font-semibold">AI</span>
          </div>
          <span className="font-semibold tracking-wide">Notes</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-3 py-2 rounded-md text-sm text-white/80 hover:text-white transition">
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-md text-sm font-medium bg-cyan-500 text-black hover:bg-cyan-400 transition"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  )
}
