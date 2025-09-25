"use client";
import { useEffect, useState } from "react";
import {
  analyticsApi,
  notificationsApi,
  getCurrentUserId,
} from "../../../lib/api";

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any | null>(null);
  const [compliance, setCompliance] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c] = await Promise.all([
          analyticsApi.summary(),
          analyticsApi.compliance(),
        ]);
        setSummary(s);
        setCompliance(c);
        const uid = getCurrentUserId() || "";
        if (uid) {
          const ns = await notificationsApi.list(uid);
          setNotifs(ns);
        }
      } catch (e: any) {
        setError(e.message || "Failed to load analytics");
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Monitor your platform's key metrics and performance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Live
              </span>
            </div>
          </div>
        </header>

        {/* Error Alert */}
        {error && (
          <div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800 dark:text-red-200 font-medium">
                {error}
              </span>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <section aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="sr-only">
              Platform Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Users Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {summary.users.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Repository Files Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Repository Files
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {summary.repoFiles.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Candidates Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Candidates
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {summary.candidates.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                    <svg
                      className="w-8 h-8 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Compliance Section */}
        {compliance && (
          <section
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            aria-labelledby="compliance-heading"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  id="compliance-heading"
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  Compliance Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Repository files with proper tagging
                </p>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Files with tags: {compliance.withTags} of{" "}
                  {compliance.repoFiles}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {compliance.tagCoverage}%
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    compliance.tagCoverage >= 80
                      ? "bg-green-500"
                      : compliance.tagCoverage >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${compliance.tagCoverage}%` }}
                  role="progressbar"
                  aria-valuenow={compliance.tagCoverage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Tag coverage: ${compliance.tagCoverage}%`}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </section>
        )}

        {/* Notifications Section */}
        <section
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          aria-labelledby="notifications-heading"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                id="notifications-heading"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                Recent Notifications
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {notifs.filter((n) => !n.read).length} unread notifications
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h6l4 4v1"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p>No notifications available</p>
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start justify-between p-4 rounded-lg border transition-colors duration-200 ${
                    !n.read
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {n.message}
                    </p>
                  </div>

                  {!n.read && (
                    <button
                      onClick={async () => {
                        await notificationsApi.markRead(n._id);
                        setNotifs((arr) =>
                          arr.map((x) =>
                            x._id === n._id ? { ...x, read: true } : x
                          )
                        );
                      }}
                      className="ml-4 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      aria-label={`Mark "${n.title}" as read`}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Export Section */}
        <section
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          aria-labelledby="export-heading"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                id="export-heading"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                Export Data
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Download or print your analytics data
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (!summary) return;
                const rows = [
                  ["Metric", "Value"],
                  ["Users", summary.users],
                  ["Repository Files", summary.repoFiles],
                  ["Candidates", summary.candidates],
                  compliance
                    ? ["Tag Coverage %", compliance.tagCoverage]
                    : null,
                ].filter(Boolean) as any[];
                const csv = rows.map((r) => r.join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "analytics.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              disabled={!summary}
              className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Export data as CSV file"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              Export CSV
            </button>

            <button
              onClick={() => {
                const w = window.open("", "_blank");
                if (!w) return;
                w.document.write(
                  "<html><head><title>Analytics</title></head><body>"
                );
                w.document.write(document.body.innerHTML);
                w.document.write("</body></html>");
                w.document.close();
                w.focus();
                w.print();
              }}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Print or save as PDF"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print / PDF
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
