"use client";
import { useEffect, useState } from "react";
import { gradingApi } from "../../../lib/api";

export default function RubricsPage() {
  const [rubrics, setRubrics] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [criteria, setCriteria] = useState<
    { name: string; weight: number; maxScore: number }[]
  >([]);
  const [critName, setCritName] = useState("");
  const [critWeight, setCritWeight] = useState(0);
  const [critMax, setCritMax] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const list = await gradingApi.rubrics.list();
      setRubrics(list);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    }
  };
  useEffect(() => {
    load();
  }, []);

  const addCriterion = () => {
    if (!critName.trim()) return;
    setCriteria((c) => [
      ...c,
      {
        name: critName.trim(),
        weight: Number(critWeight),
        maxScore: Number(critMax),
      },
    ]);
    setCritName("");
    setCritWeight(0);
    setCritMax(10);
  };

  const createRubric = async () => {
    setError(null);
    try {
      await gradingApi.rubrics.create({ title, criteria });
      setTitle("");
      setCriteria([]);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to create rubric");
    }
  };

  const remove = async (id: string) => {
    await gradingApi.rubrics.remove(id);
    await load();
  };

  const totalWeight = criteria.reduce((a, c) => a + (Number(c.weight) || 0), 0);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Rubric Builder</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="border rounded p-4 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Rubric title"
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-2 items-end">
          <input
            value={critName}
            onChange={(e) => setCritName(e.target.value)}
            placeholder="Criterion name"
            className="flex-1 border rounded px-3 py-2"
          />
          <input
            type="number"
            value={critWeight}
            onChange={(e) => setCritWeight(Number(e.target.value))}
            placeholder="Weight %"
            className="w-32 border rounded px-3 py-2"
          />
          <input
            type="number"
            value={critMax}
            onChange={(e) => setCritMax(Number(e.target.value))}
            placeholder="Max score"
            className="w-32 border rounded px-3 py-2"
          />
          <button
            onClick={addCriterion}
            className="px-3 py-2 bg-gray-200 rounded"
          >
            Add
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Total weight: {totalWeight}%
        </div>
        <ul className="list-disc pl-5 text-sm">
          {criteria.map((c, i) => (
            <li key={i}>
              {c.name} — {c.weight}% of {c.maxScore}
            </li>
          ))}
        </ul>
        <button
          onClick={createRubric}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Create Rubric
        </button>
      </div>

      <div>
        <h2 className="font-medium mb-2">Existing Rubrics</h2>
        <div className="grid gap-2">
          {rubrics.map((r) => (
            <div key={r._id} className="border rounded p-3">
              <div className="font-medium">{r.title}</div>
              <div className="text-sm">
                Criteria:{" "}
                {(r.criteria || [])
                  .map((c: any) => `${c.name}(${c.weight}%/${c.maxScore})`)
                  .join(", ")}
              </div>
              <button
                onClick={() => remove(r._id)}
                className="text-red-600 text-sm mt-1"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
