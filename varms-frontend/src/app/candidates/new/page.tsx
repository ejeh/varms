"use client";
import { useState } from "react";
import { candidatesApi } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function NewCandidatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);
  const [docInput, setDocInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addDoc = () => {
    if (!docInput.trim()) return;
    setDocuments((d) => [...d, docInput.trim()]);
    setDocInput("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await candidatesApi.create({ name, dept, documents });
      router.push("/dashboard/supervisor");
    } catch (e: any) {
      setError(e.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Register Candidate</h1>
      <form onSubmit={submit} className="space-y-3">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          placeholder="Department"
          className="w-full border rounded px-3 py-2"
          required
        />
        <div>
          <div className="font-medium mb-1">Documents (URLs or filenames)</div>
          <div className="flex gap-2">
            <input
              value={docInput}
              onChange={(e) => setDocInput(e.target.value)}
              placeholder="Add document"
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={addDoc}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              Add
            </button>
          </div>
          <ul className="list-disc pl-5 text-sm mt-2">
            {documents.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
