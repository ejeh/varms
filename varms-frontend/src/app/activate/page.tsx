"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function ActivatePage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "loading"
  >("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Missing activation token.");
      return;
    }
    setStatus("loading");
    authApi
      .activate(token)
      .then(() => {
        setStatus("success");
        setMessage("Your account has been activated. Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Activation link is invalid or expired.");
        setTimeout(() => router.push("/login"), 2000);
      });
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
            Account Activation
          </h1>
          <p
            className={
              "mt-3 text-sm " +
              (status === "error"
                ? "text-red-700 dark:text-red-300"
                : status === "success"
                ? "text-green-700 dark:text-green-300"
                : "text-slate-600 dark:text-slate-300")
            }
          >
            {status === "loading" ? "Activating your account..." : message}
          </p>
        </div>
      </div>
    </div>
  );
}
