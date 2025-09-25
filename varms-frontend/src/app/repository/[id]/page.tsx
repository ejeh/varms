"use client";
import { useEffect, useState } from "react";
import { repoApi, plagApi, getCurrentUserRole } from "../../../lib/api";

export default function RepoDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [item, setItem] = useState<any | null>(null);
  const [newVersion, setNewVersion] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plag, setPlag] = useState<any | null>(null);
  const [plagMsg, setPlagMsg] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await repoApi.get(id);
      setItem(data);
      try {
        const latest = await plagApi.latest(id);
        setPlag(latest);
      } catch {}
    } catch (e: any) {
      setError(e.message || "Failed to load");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (!item) return;
    let timer: any;
    const role = (getCurrentUserRole() || "").toLowerCase();
    const canView = ["admin", "supervisor", "examiner"].includes(role);
    if (!canView) return;
    const poll = async () => {
      try {
        const latest = await plagApi.latest(id);
        setPlag(latest);
        if (latest.status === "completed" || latest.status === "failed") return;
      } catch {}
      timer = setTimeout(poll, 5000);
    };
    poll();
    return () => clearTimeout(timer);
  }, [item, id]);

  const uploadVersion = async () => {
    if (!newVersion) return;
    setError(null);
    try {
      await repoApi.addVersion(id, newVersion);
      setNewVersion(null);
      await load();
    } catch (e: any) {
      setError(e.message || "Failed to upload");
    }
  };

  const submitPlagiarism = async () => {
    setPlagMsg(null);
    try {
      const rep = await plagApi.submit(id);
      setPlag(rep);
      setPlagMsg("Submitted for plagiarism check. Status: queued");
    } catch (e: any) {
      setPlagMsg(e.message || "Failed to submit");
    }
  };

  if (!item) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{item.title}</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="text-gray-700">{item.description}</div>
      <div className="text-sm text-gray-500">
        Tags: {(item.tags || []).join(", ")}
      </div>
      <div className="space-y-2">
        <div className="font-medium">Versions</div>
        <ul className="list-disc pl-5 text-sm">
          {(item.versions || [])
            .slice()
            .sort((a: any, b: any) => b.version - a.version)
            .map((v: any) => (
              <li key={v.version} className="flex items-center gap-2">
                <span>
                  v{v.version} • {new Date(v.uploadedAt).toLocaleString()} •{" "}
                  {v.filename}
                </span>
                <a
                  className="text-blue-600"
                  href={repoApi.downloadUrl(item._id, v.version)}
                >
                  Download
                </a>
              </li>
            ))}
        </ul>
      </div>
      {(() => {
        const role = (getCurrentUserRole() || "").toLowerCase();
        const canView = ["admin", "supervisor", "examiner"].includes(role);
        return (
          <div className="space-y-2">
            <div className="font-medium">Plagiarism</div>
            {canView ? (
              <>
                {plag && (
                  <div className="text-sm">
                    Status: {plag.status}{" "}
                    {plag.similarity != null &&
                      `• Similarity: ${plag.similarity}%`}
                    {plag.reportUrl && (
                      <a
                        className="text-blue-600 ml-2"
                        href={plag.reportUrl}
                        target="_blank"
                      >
                        View report
                      </a>
                    )}
                  </div>
                )}
                {plagMsg && (
                  <div className="text-sm text-gray-700">{plagMsg}</div>
                )}
                <button
                  onClick={submitPlagiarism}
                  className="px-3 py-2 bg-indigo-600 text-white rounded"
                >
                  Submit for Check
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-600">
                You do not have permission to view the plagiarism report.
              </div>
            )}
          </div>
        );
      })()}
      <div className="space-y-2">
        <div className="font-medium">Add New Version</div>
        <input
          type="file"
          onChange={(e) => setNewVersion(e.target.files?.[0] || null)}
        />
        <button
          onClick={uploadVersion}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Upload Version
        </button>
      </div>
      <div>
        <div className="font-medium">Preview</div>
        {/* Basic preview: for PDFs may rely on browser download/inline handler */}
        <iframe
          src={repoApi.downloadUrl(item._id)}
          className="w-full h-96 border rounded"
        />
      </div>
    </div>
  );
}
