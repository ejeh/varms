"use client";
import { useEffect, useState } from "react";
import { paymentsApi } from "../../../../lib/api";

export default function PaymentStatus({
  params,
}: {
  params: { reference: string };
}) {
  const { reference } = params;
  const [tx, setTx] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    paymentsApi
      .byReference(reference)
      .then(setTx)
      .catch((e) => setError(e.message || "Failed"));
  }, [reference]);

  if (!tx) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">Payment Status</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>Reference: {tx.reference}</div>
      <div>
        Amount: {tx.amount} {tx.currency}
      </div>
      <div>Status: {tx.status}</div>
      <div>Provider: {tx.provider}</div>
    </div>
  );
}
