import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try {
    const {content} = await req.json();
  
    if(!content){
      return NextResponse.json(
        {error: "No content Provided"},
        {status: 400}
      )
    }
  
    const correctedText = await GrammarCorrection(content);
  
    return NextResponse.json(
      {corrected: correctedText},
      {status: 200}
    )
  } catch (error) {
    console.error("Grammar check error: ", error);
    return NextResponse.json(
      {error: "Failed to check Grammar"},
      {status: 500}
    )
  }
}

// temporary mock till ai integration
async function GrammarCorrection(text: string):Promise<string> {
  return text.replace(/\bi\b/g, "I");
}