import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Proofread and correct the following text. 
Always return only the corrected version, even if no changes are needed:\n\n${text}`;

    const result = await model.generateContent(prompt);

    // Extract the text safely
    const corrected = result.response.candidates?.[0].content.parts?.[0].text ||
      "Unable to fix grammar.";      

    return NextResponse.json({ grammarizedText: corrected });
  } catch (error) {
    console.error("Grammar API error:", error);
    return NextResponse.json(
      { grammarizedText: "Error fixing grammar." },
      { status: 500 }
    );
  }
}
