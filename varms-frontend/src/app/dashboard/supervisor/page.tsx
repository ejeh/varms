"use client";
import { useEffect, useState } from "react";
import { candidatesApi, supervisorsApi } from "../../../lib/api";

export default function SupervisorDashboard() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await candidatesApi.list();
        setCandidates(data);
      } catch (e: any) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Supervisor Dashboard</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid gap-3">
        {candidates.map((c) => (
          <div key={c._id} className="border rounded p-3">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-gray-600">Dept: {c.dept}</div>
            <div className="text-sm">Status: {c.status}</div>
            <a className="text-blue-600 text-sm" href={`/candidates/${c._id}`}>
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
