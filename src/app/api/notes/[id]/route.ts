import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { connectToDatabase } from "../../../../../lib/db";
import Note from "../../../../../models/Note";
import User from "../../../../../models/User";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;

  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const note = await Note.findOne({ _id: id, user: user._id }).select("_id title content createdAt updatedAt");
  if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  return NextResponse.json(note);
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { title, content } = await req.json();
  const updated = await Note.findOneAndUpdate(
    { _id: id, user: user._id },
    { ...(title !== undefined && { title }), ...(content !== undefined && { content }) },
    { new: true }
  ).select("_id title content createdAt updatedAt");

  if (!updated) return NextResponse.json({ error: "Note not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const deleted = await Note.findOneAndDelete({ _id: id, user: user._id });
  if (!deleted) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}