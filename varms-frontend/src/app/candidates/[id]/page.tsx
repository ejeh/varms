"use client";
import { useEffect, useState } from "react";
import { candidatesApi, gradingApi } from "../../../lib/api";

export default function CandidateDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [candidate, setCandidate] = useState<any | null>(null);
  const [milestoneInput, setMilestoneInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aggregate, setAggregate] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await candidatesApi.get(id);
        setCandidate(data);
        try {
          const agg = await gradingApi.aggregate(id);
          setAggregate(agg);
          const list = await gradingApi.feedback.listByCandidate(id);
          setFeedback(list);
        } catch {}
      } catch (e: any) {
        setError(e.message || "Failed to load");
      }
    };
    load();
  }, [id]);

  const addMilestone = async () => {
    if (!candidate || !milestoneInput.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await candidatesApi.update(id, {
        milestones: [...(candidate.milestones || []), milestoneInput.trim()],
      });
      setCandidate(updated);
      setMilestoneInput("");
    } catch (e: any) {
      setError(e.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (!candidate) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{candidate.name}</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {aggregate && (
        <div className="text-sm bg-gray-50 border rounded p-3">
          <div>Aggregate (published): {aggregate.averagePercentage}%</div>
          <div>
            GPA: {aggregate.gpa ?? 0} (from {aggregate.count} feedback)
          </div>
        </div>
      )}
      <div className="text-gray-700">Department: {candidate.dept}</div>
      <div>Status: {candidate.status}</div>
      <div>
        <div className="font-medium">Milestones</div>
        <ul className="list-disc pl-5 text-sm">
          {(candidate.milestones || []).map((m: string, i: number) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
        <div className="flex gap-2 mt-2">
          <input
            value={milestoneInput}
            onChange={(e) => setMilestoneInput(e.target.value)}
            placeholder="Add milestone"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={addMilestone}
            disabled={saving}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            {saving ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
      <div>
        <div className="font-medium">Documents</div>
        <ul className="list-disc pl-5 text-sm">
          {(candidate.documents || []).map((d: string, i: number) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-medium">Feedback</div>
        <ul className="list-disc pl-5 text-sm">
          {feedback.map((f: any) => (
            <li key={f._id}>
              {new Date(f.createdAt).toLocaleString()} — {f.totalPercentage}%{" "}
              {f.published ? "(Published)" : "(Draft)"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
