import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { connectToDatabase } from "../../../../../lib/db";
import Note from "../../../../../models/Note";
import User from "../../../../../models/User";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }


  const { title, content } = await req.json();
  const updatedNote = await Note.findOneAndUpdate(
    { _id: params.id, userId: user._id },
    { title, content },
    { new: true }
  );

  if (!updatedNote) {
    return NextResponse.json(
      { error: 'Note not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(updatedNote);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401 }
    );
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const deletedNote = await Note.findOneAndDelete({ _id: params.id, userId: user._id })
  if (!deletedNote) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}