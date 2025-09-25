"use client";
import { usePathname } from "next/navigation";
import Layout from "@/components/Layout";

const BYPASS_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
]);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bypass =
    pathname && Array.from(BYPASS_ROUTES).some((p) => pathname.startsWith(p));
  if (bypass) return <>{children}</>;
  return <Layout>{children}</Layout>;
}
