"use client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="flex space-x-4">
        <button 
          onClick={() => router.push("/dashboard/notes")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Notes
        </button>
        <button 
          onClick={() => router.push("/dashboard/summarize")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Summarizer
        </button>
        <button 
          onClick={() => router.push("/dashboard/grammar")}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Grammar
        </button>
      </div>
    </div>
  );
}
