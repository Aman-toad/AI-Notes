import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "No text provided." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Summarize the following text in a concise way:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text() || "Unable to summarize.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error summarizing:", error);
    return NextResponse.json({ error: "Failed to summarize text." }, { status: 500 });
  }
}
