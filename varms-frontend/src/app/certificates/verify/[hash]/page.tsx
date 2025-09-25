"use client";
import { useEffect, useState } from "react";
import { certificatesApi } from "../../../../../lib/api";

export default function VerifyCertificate({
  params,
}: {
  params: { hash: string };
}) {
  const { hash } = params;
  const [cert, setCert] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    certificatesApi
      .verify(hash)
      .then(setCert)
      .catch((e) => setError(e.message || "Invalid certificate"));
  }, [hash]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!cert) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Certificate Verification</h1>
      <div>Name: {cert.name}</div>
      <div>Owner: {cert.userId}</div>
      <div>Hash: {cert.hash}</div>
      <div>
        <img alt="QR" src={cert.qrCodeUrl} />
      </div>
      <a className="text-blue-600" target="_blank" href={cert.pdfUrl}>
        Open PDF
      </a>
    </div>
  );
}
