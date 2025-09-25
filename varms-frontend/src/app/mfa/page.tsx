"use client";
import { useState } from "react";
import { authApi } from "../../lib/api";

export default function MFAPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [totp, setTotp] = useState<{
    secret: string;
    otpauth_url: string;
  } | null>(null);
  const [totpToken, setTotpToken] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const requestOtp = async () => {
    setMsg(null);
    await authApi.mfa.requestOtp(email);
    setOtpSent(true);
    setMsg("OTP sent if email exists.");
  };

  const verifyOtp = async () => {
    setMsg(null);
    await authApi.mfa.verifyOtp(email, code);
    setMsg("OTP verified and MFA enabled.");
  };

  const setupTotp = async () => {
    setMsg(null);
    const data = await authApi.mfa.totpSetup();
    setTotp(data);
  };

  const verifyTotp = async () => {
    setMsg(null);
    await authApi.mfa.totpVerify(totpToken);
    setMsg("TOTP verified.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white shadow rounded p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Multi-Factor Authentication</h1>
        {msg && <div className="text-green-700 text-sm">{msg}</div>}

        <div className="space-y-2">
          <h2 className="font-medium">Email/SMS OTP</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
          />
          <button
            onClick={requestOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Request OTP
          </button>
          {otpSent && (
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={verifyOtp}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Verify
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="font-medium">TOTP (Authenticator app)</h2>
          {!totp ? (
            <button
              onClick={setupTotp}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Setup TOTP
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-sm break-all">Secret: {totp.secret}</div>
              <div className="text-sm break-all">URL: {totp.otpauth_url}</div>
              <div className="flex gap-2">
                <input
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value)}
                  placeholder="Enter 6-digit token"
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={verifyTotp}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
