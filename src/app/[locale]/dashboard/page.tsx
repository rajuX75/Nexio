'use client';

import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome, {session.user?.name || session.user?.username}!</p>
      <div className="mt-4 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold">Session Data:</h2>
        <pre className="mt-2 text-sm">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
