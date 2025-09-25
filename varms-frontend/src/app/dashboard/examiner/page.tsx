"use client";
import Link from "next/link";

export default function ExaminerDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Examiner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <div className="font-medium mb-1">Feedback & Grading</div>
          <p className="text-sm text-gray-600 mb-2">
            Submit feedback using configured rubrics.
          </p>
          <Link href="/grading/feedback/new" className="text-blue-600">
            Submit Feedback
          </Link>
        </div>
        <div className="border rounded p-4">
          <div className="font-medium mb-1">Repository</div>
          <p className="text-sm text-gray-600 mb-2">
            Review submissions and versions.
          </p>
          <Link href="/repository" className="text-blue-600">
            Open Repository
          </Link>
        </div>
        <div className="border rounded p-4">
          <div className="font-medium mb-1">Defences</div>
          <p className="text-sm text-gray-600 mb-2">
            View defence schedules and log attendance.
          </p>
          <Link href="/defence" className="text-blue-600">
            View Defences
          </Link>
        </div>
      </div>
    </div>
  );
}
