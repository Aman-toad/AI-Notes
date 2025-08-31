"use client"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    try {
      setLoading(true)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const contentType = res.headers.get("content-type") || ""
      let data: any = null
      if (contentType.includes("application/json")) {
        data = await res.json()
      } else {
        const text = await res.text()
        try {
          data = JSON.parse(text)
        } catch {
          data = { error: text?.slice(0, 300) || "Unexpected response from server" }
        }
      }

      if (!res.ok) {
        throw new Error(data?.error || "Registration failed")
      }

      router.push("/login")
    } catch (error: any) {
      console.log(error)
      setErrorMsg(error?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-[100svh] bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-20%,#0b1220,transparent)]" />
      <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-md bg-cyan-500/20 ring-1 ring-cyan-400/30 flex items-center justify-center">
              <span className="text-cyan-300 text-sm font-semibold">AI</span>
            </div>
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="text-sm text-white/60">Join AI-Notes in seconds</p>
          </div>

          {/* Error message surface */}
          {errorMsg ? (
            <div className="mb-4 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/80">
              {errorMsg}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-white/80">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-0 focus:border-cyan-400/40"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-white/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-0 focus:border-cyan-400/40"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-white/80">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-0 focus:border-cyan-400/40"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm text-white/80">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-0 focus:border-cyan-400/40"
                placeholder="••••••••"
                aria-describedby="password-hint"
              />
              <p id="password-hint" className="mt-1 text-xs text-white/50">
                Must match your password exactly.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-cyan-500 px-4 py-2 font-medium text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full rounded-md bg-white px-4 py-2 font-medium text-black transition hover:bg-white/90"
            >
              Continue with Google
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
