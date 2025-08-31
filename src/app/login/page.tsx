"use client"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import PageTransition from "@/components/PageTransition"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const [error, setError] = useState("")
  const { data: session } = useSession()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await signIn("credentials", { email, password, redirect: false })
    if (result?.error) {
      console.log(result.error)
      setError("Something went Wrong check email and password again !")
    } else {
      router.push("/dashboard")
    }
    if (session) {
      return
    }
  }

  return (
    <main className="relative min-h-[100svh] bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-20%,#0b1220,transparent)]" />
      <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-center justify-center px-4 py-10">
        <PageTransition>
          <div className="w-80 md:w-100 max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-md bg-cyan-500/20 ring-1 ring-cyan-400/30 flex items-center justify-center">
                <span className="text-cyan-300 text-sm font-semibold">AI</span>
              </div>
              <h1 className="text-2xl font-semibold">Welcome back</h1>
              <p className="text-sm text-white/60">Sign in to continue to AI-Notes</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
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
                  autoComplete="current-password"
                  className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-white placeholder:text-white/40 outline-none ring-0 focus:border-cyan-400/40"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-cyan-500 px-4 py-2 font-medium text-black transition hover:bg-cyan-400"
              >
                Sign in
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
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline">
                Create one
              </Link>
            </p>

            {error && (
              <p className="text-red-500">
                {error}
              </p>
            )}
          </div>
        </PageTransition>
      </div>
    </main>
  )
}
