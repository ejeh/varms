"use client";
import Link from "next/link";

export default function StudentDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <div className="font-medium mb-1">Research Repository</div>
          <p className="text-sm text-gray-600 mb-2">
            Upload and manage your documents.
          </p>
          <Link href="/repository" className="text-blue-600">
            Open Repository
          </Link>
        </div>
        <div className="border rounded p-4">
          <div className="font-medium mb-1">Certificates</div>
          <p className="text-sm text-gray-600 mb-2">
            View and verify your certificates.
          </p>
          <Link href="/certificates" className="text-blue-600">
            View Certificates
          </Link>
        </div>
        <div className="border rounded p-4">
          <div className="font-medium mb-1">Defence Schedule</div>
          <p className="text-sm text-gray-600 mb-2">
            See upcoming defence sessions and join.
          </p>
          <Link href="/defence" className="text-blue-600">
            View Defences
          </Link>
        </div>
        <div className="border rounded p-4">
          <div className="font-medium mb-1">Payments</div>
          <p className="text-sm text-gray-600 mb-2">
            Make payments and track status.
          </p>
          <Link href="/payments/checkout" className="text-blue-600">
            Go to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
