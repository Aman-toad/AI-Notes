import { NextRequest, NextResponse } from "next/server";
// import your AI helper here

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    // Replace with your AI call
    const summary = await fakeSummarize(content);

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
  }
}

// Temporary mock until AI integration
async function fakeSummarize(text: string): Promise<string> {
  return text.length > 50 ? text.slice(0, 50) + "..." : text;
}
