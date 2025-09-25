"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

type Role = "Admin" | "Student" | "Supervisor" | "Examiner" | "Guest";

type MenuItem = {
  label: string;
  href: string;
};

export type SidebarProps = {
  role?: Role;
  onNavigate?: () => void;
  className?: string;
};

const baseClass =
  "h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col";

function getMenuForRole(role: Role): MenuItem[] {
  switch (role) {
    case "Admin":
      return [
        { label: "Dashboard", href: "/dashboard/admin" },
        { label: "Candidates", href: "/candidates" },
        { label: "Certificates", href: "/certificates" },
        { label: "Grading", href: "/grading/rubrics" },
      ];
    case "Student":
      return [
        { label: "Dashboard", href: "/dashboard/student" },
        { label: "Repository", href: "/repository" },
        { label: "Defence", href: "/defence" },
        { label: "Payments", href: "/payments/checkout" },
      ];
    case "Supervisor":
      return [
        { label: "Dashboard", href: "/dashboard/supervisor" },
        { label: "Candidates", href: "/candidates" },
        { label: "Grading", href: "/grading/feedback/new" },
      ];
    case "Examiner":
      return [
        { label: "Dashboard", href: "/dashboard/examiner" },
        { label: "Reviews", href: "/grading/review/1" },
        { label: "Certificates", href: "/certificates" },
      ];
    default:
      return [
        { label: "Home", href: "/" },
        { label: "Login", href: "/login" },
        { label: "Signup", href: "/signup" },
      ];
  }
}

export function Sidebar({
  role = "Guest",
  onNavigate,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const items = useMemo(() => getMenuForRole(role), [role]);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname?.startsWith(href + "/"),
    [pathname]
  );

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {}
    router.replace("/login");
  }, [router]);

  return (
    <aside className={`${baseClass} ${className ?? ""}`}>
      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/"
          className="text-lg font-semibold text-slate-900 dark:text-white"
        >
          VARMS
        </Link>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {role}
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full inline-flex justify-center items-center px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
