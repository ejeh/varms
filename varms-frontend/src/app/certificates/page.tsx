"use client";
import { useEffect, useState } from "react";
import { certificatesApi, getCurrentUserId } from "../../lib/api";

export default function CertificatesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = getCurrentUserId() || "";
    certificatesApi
      .listByUser(userId)
      .then(setItems)
      .catch((e) => setError(e.message || "Failed"));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Certificates</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid gap-3">
        {items.map((c) => (
          <div key={c._id} className="border rounded p-3">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm">Hash: {c.hash}</div>
            <div className="flex gap-2 mt-2">
              <a
                className="px-3 py-2 bg-blue-600 text-white rounded"
                href={c.pdfUrl}
                target="_blank"
              >
                Download PDF
              </a>
              <a
                className="px-3 py-2 bg-gray-200 rounded"
                href={`/certificates/verify/${c.hash}`}
              >
                Verify
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
