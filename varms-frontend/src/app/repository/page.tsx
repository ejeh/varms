"use client";
import { useEffect, useState } from "react";
import { repoApi } from "../../lib/api";

export default function RepositoryPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await repoApi.list(query);
      setItems(data);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Research Repository</h1>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, description, tag"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={() => load(q)}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
        <a href="/repository/upload" className="px-3 py-2 bg-gray-200 rounded">
          Upload
        </a>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid gap-3">
        {items.map((it) => (
          <a
            key={it._id}
            href={`/repository/${it._id}`}
            className="border rounded p-3 hover:bg-gray-50"
          >
            <div className="font-medium">{it.title}</div>
            <div className="text-sm text-gray-600">{it.description}</div>
            <div className="text-xs text-gray-500">
              Tags: {(it.tags || []).join(", ")}
            </div>
            <div className="text-xs">Latest Version: {it.latestVersion}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
