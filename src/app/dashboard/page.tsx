"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import NoteForm from '@/components/NoteForm';
import NotesList from '@/components/NotesList';

interface Note {
  _id: string;
  title: string;
  content: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notes');
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching Notes: ', error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  //add new note handler
  const handleAddNote = async (title: string, content: string) => {
    try {
      const res  = await fetch('/api/notes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, content})
      });
      if(!res.ok) throw new Error('Failed to add note');
      await fetchNotes();
    } catch (error) {
      console.error('Error adding Note: ', error);
    }
  };

  //update existing note handler
  const handleUpdateNote = async (title: string, content: string) => {
    if(!editingNote) return;
    try {
      const res = await fetch(`/api/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, content}),
      });
      if(!res.ok) throw new Error('Failed to update note')
    } catch (error) {
      console.error('Error updating Note: ', error);      
    }
  };

  // deleting note handler
  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      }) 
      if(!res.ok) throw new Error('Failed to delete note');
    } catch (error) {
      console.error('Error Deleting note: ', error);      
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  return (
    <div className='flex flex-col justify-center text-center'>
      <h1 className='text-3xl'>Dashboard</h1>
      <p className='text-green-600'>Welcome, {session.user?.name || 'User'}!</p>
      <p>Email: {session.user?.email}</p>

      <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Note Form - used for both adding and editing */}
      <NoteForm
        onSubmit={editingNote ? handleUpdateNote : handleAddNote}
        initialTitle={editingNote?.title}
        initialContent={editingNote?.content}
        submitLabel={editingNote ? 'Update Note' : 'Add Note'}
      />

      {/* Notes Section */}
      {loading ? (
        <p className="text-gray-500">Loading notes...</p>
      ) : (
        <NotesList 
          notes={notes} 
          onEdit={(note) => setEditingNote(note)} 
          onDelete={handleDeleteNote} 
        />
      )}
    </div>
    </div>
  );
}