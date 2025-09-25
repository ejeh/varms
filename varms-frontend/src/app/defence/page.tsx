"use client";
import { useEffect, useState } from "react";
import { defenceApi } from "../../lib/api";

export default function DefenceListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    defenceApi
      .list()
      .then(setItems)
      .catch((e) => setError(e.message || "Failed"));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Defences</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid gap-2">
        {items.map((d) => (
          <a
            key={d._id}
            href={`/defence/${d._id}`}
            className="border rounded p-3 hover:bg-gray-50"
          >
            <div className="font-medium">{d.title}</div>
            <div className="text-sm text-gray-600">
              {new Date(d.scheduledAt).toLocaleString()}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
