"use client";
import { useEffect, useMemo, useState } from "react";
import { gradingApi, repoApi, getCurrentUserRole } from "../../../../lib/api";

export default function NewFeedbackPage() {
  const [rubrics, setRubrics] = useState<any[]>([]);
  const [rubricId, setRubricId] = useState<string>("");
  const [candidateId, setCandidateId] = useState<string>("");
  const [repoFileId, setRepoFileId] = useState<string>("");
  const [examinerId, setExaminerId] = useState<string>("");
  const [scores, setScores] = useState<
    { criterionName: string; score: number; comment?: string }[]
  >([]);
  const [overallComment, setOverallComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    gradingApi.rubrics
      .list()
      .then(setRubrics)
      .catch(() => {});
  }, []);

  const selectedRubric = useMemo(
    () => rubrics.find((r) => r._id === rubricId),
    [rubrics, rubricId]
  );

  useEffect(() => {
    if (!selectedRubric) return;
    setScores(
      (selectedRubric.criteria || []).map((c: any) => ({
        criterionName: c.name,
        score: 0,
      }))
    );
  }, [selectedRubric]);

  const onChangeScore = (i: number, value: number) => {
    setScores((arr) =>
      arr.map((s, idx) => (idx === i ? { ...s, score: value } : s))
    );
  };

  const submit = async () => {
    setError(null);
    setSaving(true);
    try {
      await gradingApi.feedback.submit({
        candidateId,
        repoFileId: repoFileId || undefined,
        examinerId,
        rubricId,
        scores,
        overallComment,
      });
      setSaving(false);
      alert("Feedback submitted");
    } catch (e: any) {
      setSaving(false);
      setError(e.message || "Failed to submit");
    }
  };

  const role = (getCurrentUserRole() || "").toLowerCase();
  const canSubmit = ["supervisor", "examiner", "admin"].includes(role);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Submit Feedback</h1>
      {!canSubmit && (
        <div className="text-sm text-gray-600">
          You do not have permission to submit feedback.
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid gap-3 max-w-3xl">
        <input
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          placeholder="Candidate ID"
          className="border rounded px-3 py-2"
        />
        <input
          value={examinerId}
          onChange={(e) => setExaminerId(e.target.value)}
          placeholder="Examiner ID"
          className="border rounded px-3 py-2"
        />
        <select
          value={rubricId}
          onChange={(e) => setRubricId(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Select rubric</option>
          {rubrics.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>
        <input
          value={repoFileId}
          onChange={(e) => setRepoFileId(e.target.value)}
          placeholder="Repo File ID (optional)"
          className="border rounded px-3 py-2"
        />
        {repoFileId && (
          <iframe
            src={repoApi.downloadUrl(repoFileId)}
            className="w-full h-96 border rounded"
          />
        )}
        {selectedRubric && (
          <div className="border rounded p-3 space-y-2">
            <div className="font-medium">Scores</div>
            {(selectedRubric.criteria || []).map((c: any, i: number) => (
              <div key={c.name} className="flex items-center gap-3 text-sm">
                <div className="w-1/2">
                  {c.name} (max {c.maxScore}, weight {c.weight}%)
                </div>
                <input
                  type="number"
                  min={0}
                  max={c.maxScore}
                  value={scores[i]?.score ?? 0}
                  onChange={(e) => onChangeScore(i, Number(e.target.value))}
                  className="w-32 border rounded px-2 py-1"
                />
              </div>
            ))}
          </div>
        )}
        <textarea
          value={overallComment}
          onChange={(e) => setOverallComment(e.target.value)}
          placeholder="Overall comment"
          className="border rounded px-3 py-2"
        />
        <button
          disabled={!canSubmit || saving}
          onClick={submit}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          {saving ? "Saving..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
