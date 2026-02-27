"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function handleLogout() {
    const refresh = localStorage.getItem("refresh");

    try {
      if (refresh) {
        await apiPost("/api/logout/", { refresh });
      }
    } catch (err) {
      console.error("Logout error", err);
    }

    localStorage.clear();
    router.push("/login");
  }

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      router.push("/login");
      return;
    }

    apiGet("/api/me/")
      .then((data) => {
        setRole(data.role);
        localStorage.setItem("user_role", data.role);
        setLoading(false);
      })
      .catch(() => {
        localStorage.clear();
        router.push("/login");
      });
  }, [router]);

  if (loading) {
    return <div className="p-8">Checking authentication...</div>;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-indigo-600 mb-8">
            HelpDesk
          </h2>

          <nav className="space-y-3 text-slate-600">
            {/* Dashboard - visible to all */}
            <MenuItem label="Dashboard" href="/dashboard" />

            {/* CLIENT ONLY */}
            {role === "CLIENT" && (
              <>
                <MenuItem
                  label="Create Ticket"
                  href="/dashboard/tickets/create"
                />
                <MenuItem
                  label="Track My Tickets"
                  href="/dashboard/tickets"
                />
              </>
            )}

            {/* STAFF ONLY */}
            {role === "STAFF" && (
              <MenuItem
                label="My Assigned Tickets"
                href="/dashboard/tickets"
              />
            )}

            {/* ADMIN ONLY */}
            {role === "ADMIN" && (
              <>
                <MenuItem
                  label="All Tickets"
                  href="/dashboard/tickets"
                />
                <MenuItem
                  label="Manage Users"
                  href="/dashboard/users"
                />
              </>
            )}
          </nav>
        </div>

        {/* LOGOUT ALWAYS VISIBLE */}
        <div className="pt-6 border-t">
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">
        <div className="mb-6 text-sm text-slate-500">
          Logged in as: <span className="font-medium">{role}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function MenuItem({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href}>
      <div className="px-4 py-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition font-medium">
        {label}
      </div>
    </Link>
  );
}