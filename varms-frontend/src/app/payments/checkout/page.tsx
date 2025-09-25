"use client";
import { useState } from "react";
import { paymentsApi, getCurrentUserId } from "../../../lib/api";

export default function CheckoutPage() {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("NGN");
  const [provider, setProvider] = useState<string>("stub");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);

  const checkout = async () => {
    setMessage(null);
    setError(null);
    try {
      const userId = getCurrentUserId() || "";
      const tx = await paymentsApi.checkout({
        userId,
        amount,
        currency,
        provider,
      });
      setRef(tx.reference);
      setMessage(`Checkout created. Reference: ${tx.reference}`);
      if (tx.meta?.checkoutUrl) window.open(tx.meta.checkoutUrl, "_blank");
    } catch (e: any) {
      setError(e.message || "Failed to start checkout");
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold">Payment Checkout</h1>
      {message && <div className="text-green-700 text-sm">{message}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
          className="border rounded px-3 py-2"
        />
        <input
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="Currency"
          className="border rounded px-3 py-2"
        />
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="stub">Stub</option>
          <option value="paystack">Paystack</option>
          <option value="flutterwave">Flutterwave</option>
        </select>
        <button
          onClick={checkout}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Proceed to Pay
        </button>
        {ref && (
          <a className="text-blue-600 text-sm" href={`/payments/status/${ref}`}>
            View Status
          </a>
        )}
      </div>
    </div>
  );
}
