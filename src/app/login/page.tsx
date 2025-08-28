"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session } = useSession()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = await signIn("credentials", {
      email, password, redirect: false
    })

    if (result?.error) {
      console.log(result.error);
    } else {
      router.push("/")
    }

    if(session){
      return(
        <div>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form
      onSubmit={handleLogin}
      className="bg-black text-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
      <div className="mb-4">
        <label
        htmlFor="email"
        className="block text-gray-700 text-sm font-bold mb-2"
        >
        Email:
        </label>
        <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label
        htmlFor="password"
        className="block text-gray-700 text-sm font-bold mb-2"
        >
        Password:
        </label>
        <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
      >
        Login
      </button>
      </form>
      <div className="text-center">
      {/* <button onClick={() => signIn("google")} className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Sign in with Google</button> */}
      <p className="mt-4 text-gray-600">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
        Register here
        </a>
      </p>
      </div>

      <button onClick={()=> signIn("google")}>sign in with google</button>
    </div>
  )
}