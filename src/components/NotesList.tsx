"use client"

interface Note {
  _id: string;
  title: string;
  content: string
}

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NotesList({ notes, onEdit, onDelete }: NotesListProps) {
  if (notes.length === 0) {
    return <p className="text-gray-500">No notes yet.</p>
  }

  return (
    <div className="grid gap-3">
      {notes.map((note) => (
        <div key={note._id} className="p-4 border rounded bg-black shadow">
          <h3 className="font-semibold">{note.title}</h3>
          <p>{note.content}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(note)}
              className="px-3 py-1 bg-yellow-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(note._id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}