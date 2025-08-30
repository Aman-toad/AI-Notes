import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Enhance the following text to make it clearer, more professional, and more engaging while preserving its original meaning.
Improve the grammar, sentence flow, and word choice.
Do not change any facts or add new information.
Keep the language natural and human-like.
Provide only the improved text without any explanations:\n\n${text}`;

    const result = await model.generateContent(prompt);

    // Extract the text safely
    const enhance = result.response.candidates?.[0].content.parts?.[0].text ||
      "Unable to Enhance the text.";      

    return NextResponse.json({ EnhancedText: enhance });
  } catch (error) {
    console.error("Enhance Text API error:", error);
    return NextResponse.json(
      { EnhancedText: "Error enhancing text." },
      { status: 500 }
    );
  }
}
