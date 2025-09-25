"use client";
import { useEffect, useState } from "react";
import {
  defenceApi,
  getCurrentUserId,
  getCurrentUserRole,
} from "../../../lib/api";

export default function DefenceDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [d, setD] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await defenceApi.get(id);
      setD(data);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const role = (getCurrentUserRole() || "Student").toString();
  const userId = getCurrentUserId() || "";

  const join = async () => {
    try {
      await defenceApi.attendance(id, { userId, role, joined: true });
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to join");
    }
  };

  const leave = async () => {
    try {
      await defenceApi.attendance(id, { userId, role, joined: false });
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to leave");
    }
  };

  const ask = async () => {
    if (!question.trim()) return;
    setSaving(true);
    try {
      await defenceApi.addQuestion(id, { authorId: userId, question });
      setQuestion("");
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to add question");
    } finally {
      setSaving(false);
    }
  };

  const answer = async (index: number) => {
    const a = prompt("Enter answer");
    if (!a) return;
    try {
      await defenceApi.answer(id, index, a);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to answer");
    }
  };

  if (!d) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{d.title}</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="text-sm text-gray-700">
        Scheduled: {new Date(d.scheduledAt).toLocaleString()}
      </div>
      <div>
        <a
          href={d.meetingLink}
          target="_blank"
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Join Meeting
        </a>
        <button
          onClick={join}
          className="ml-2 px-3 py-2 bg-green-600 text-white rounded"
        >
          Mark Join
        </button>
        <button
          onClick={leave}
          className="ml-2 px-3 py-2 bg-gray-600 text-white rounded"
        >
          Mark Leave
        </button>
      </div>
      <div>
        <div className="font-medium">Attendance</div>
        <ul className="list-disc pl-5 text-sm">
          {(d.attendance || []).map((a: any, i: number) => (
            <li key={i}>
              {a.userId} ({a.role}) —{" "}
              {a.joinedAt ? new Date(a.joinedAt).toLocaleTimeString() : "-"} to{" "}
              {a.leftAt ? new Date(a.leftAt).toLocaleTimeString() : "-"}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-medium">Q&amp;A</div>
        <div className="flex gap-2 mb-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={ask}
            disabled={saving}
            className="px-3 py-2 bg-indigo-600 text-white rounded"
          >
            Ask
          </button>
        </div>
        <ul className="list-disc pl-5 text-sm">
          {(d.qa || []).map((q: any, i: number) => (
            <li key={i} className="mb-1">
              <div>
                Q: {q.question} — by {q.authorId}
              </div>
              <div>A: {q.answer || "—"}</div>
              {["admin", "supervisor", "examiner"].includes(
                role.toLowerCase()
              ) && (
                <button
                  onClick={() => answer(i)}
                  className="text-blue-600 text-xs"
                >
                  Answer
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
