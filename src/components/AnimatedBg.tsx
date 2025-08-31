"use client"

export function AnimatedBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,#0b1220,transparent)]" />
      {/* Cyan glow orbs */}
      <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-pulse [animation-delay:300ms]" />
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
    </div>
  )
}
