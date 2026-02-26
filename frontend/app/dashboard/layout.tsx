"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPatch } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }
    
    apiPatch(`/api/tickets/api/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setRole(data.role))
      .catch(() => router.push("/login"));
  }, [router]);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-semibold text-indigo-600 mb-8">
          HelpDesk
        </h2>

        <nav className="space-y-4 text-slate-600">
          <div className="hover:text-indigo-500 cursor-pointer transition">
            Dashboard
          </div>
          <div className="hover:text-indigo-500 cursor-pointer transition">
            Tickets
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-6 text-sm text-slate-500">
          Logged in as: <span className="font-medium">{role}</span>
        </div>

        {children}
      </div>
    </div>
  );
}