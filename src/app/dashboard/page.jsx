"use client"
import React from 'react';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  console.log(session.user.name)

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name || 'User'}!</p>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}