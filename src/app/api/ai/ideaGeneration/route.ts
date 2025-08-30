import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Generate 3-5 creative and practical ideas related to this note or related to daily works like todo, exercise , writing book, start project. The ideas should be clear, concise, and directly relevant to the topic. Write them as short bullet points without adding extra explanation or unrelated content. Output only the list of ideas:\n\n${text}`;

    const result = await model.generateContent(prompt);

    // Extract the text safely
    const idea = result.response.candidates?.[0].content.parts?.[0].text ||
      "Unable to generate the idea.";      

    return NextResponse.json({ generatedIdea: idea });
  } catch (error) {
    console.error("idea generation API error:", error);
    return NextResponse.json(
      { generatedIdea: "Error generating the idea." },
      { status: 500 }
    );
  }
}
