"use client";
import { useEffect, useState } from "react";
import {
  gradingApi,
  repoApi,
  getCurrentUserRole,
} from "../../../../../lib/api";

export default function FeedbackReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [fb, setFb] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await gradingApi.feedback.get(id);
      setFb(data);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const role = (getCurrentUserRole() || "").toLowerCase();
  const canPublish = role === "admin";

  const togglePublish = async () => {
    if (!fb) return;
    setSaving(true);
    try {
      const updated = await gradingApi.feedback.publish(fb._id, !fb.published);
      setFb(updated);
    } catch (e: any) {
      setError(e.message || "Failed to update publish state");
    } finally {
      setSaving(false);
    }
  };

  if (!fb) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Feedback Review</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="text-sm text-gray-700">Candidate: {fb.candidateId}</div>
      <div className="text-sm text-gray-700">Examiner: {fb.examinerId}</div>
      <div className="text-sm">Total: {fb.totalPercentage}%</div>
      <div className="text-sm">
        Status: {fb.published ? "Published" : "Draft"}
      </div>
      {canPublish && (
        <button
          onClick={togglePublish}
          disabled={saving}
          className="px-3 py-2 bg-indigo-600 text-white rounded"
        >
          {saving ? "Saving..." : fb.published ? "Unpublish" : "Publish"}
        </button>
      )}

      <div className="space-y-2">
        <div className="font-medium">Scores</div>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 border">Criterion</th>
              <th className="text-left p-2 border">Score</th>
              <th className="text-left p-2 border">Comment</th>
            </tr>
          </thead>
          <tbody>
            {(fb.scores || []).map((s: any, i: number) => (
              <tr key={i}>
                <td className="p-2 border">{s.criterionName}</td>
                <td className="p-2 border">{s.score}</td>
                <td className="p-2 border">{s.comment || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {fb.repoFileId && (
        <div className="space-y-2">
          <div className="font-medium">Document Preview</div>
          <iframe
            src={repoApi.downloadUrl(fb.repoFileId)}
            className="w-full h-96 border rounded"
          />
        </div>
      )}

      {fb.overallComment && (
        <div className="space-y-1">
          <div className="font-medium">Overall Comment</div>
          <div className="text-sm">{fb.overallComment}</div>
        </div>
      )}
    </div>
  );
}
