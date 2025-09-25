"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { getRoleFromToken } from "@/lib/auth";

export type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string>("Guest");

  useEffect(() => {
    const r = getRoleFromToken() || "Guest";
    setRole(r);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle sidebar"
            onClick={() => setIsOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Role: {role}
          </div>
          <div />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          {/* Sidebar - desktop */}
          <div className="hidden lg:block flex-shrink-0">
            <Sidebar role={role as any} />
          </div>

          {/* Sidebar - mobile overlay */}
          {isOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-64">
                <Sidebar
                  role={role as any}
                  onNavigate={() => setIsOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
