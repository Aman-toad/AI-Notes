"use client"

import { useState } from "react";

interface NoteFormProps {
  onSubmit: (title: string, content: string) => void;
  initialTitle?: string;
  initialContent?: string;
  submitLabel?: string;
}

export default function NoteForm({
  onSubmit,
  initialTitle = "",
  initialContent = "",
  submitLabel = 'Add Note'
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(title, content);
        setTitle('');
        setContent('');
      }}
      className="space-y-3 border p-4 rounded-lg bg-black shadow"
    >
      <input
        className="w-full p-2 border rounded"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Note content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={10}
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        {submitLabel}
      </button>
    </form>
  )
}