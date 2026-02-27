"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("status");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRole(localStorage.getItem("user_role"));
  }, []);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  async function fetchData(tab: string) {
    setLoading(true);

    try {
      let endpoint = "";

      if (tab === "status") endpoint = "/api/dashboard/summary/";
      if (tab === "monthly") endpoint = "/api/dashboard/monthly/";
      if (tab === "client") endpoint = "/api/dashboard/client-wise/";
      if (tab === "staff") endpoint = "/api/dashboard/staff-wise/";

      const data = await apiGet(endpoint);

      // Transform data to common format for chart
      let formatted: any[] = [];

      if (tab === "status") {
        formatted = [
          { name: "CREATED", value: data.created },
          { name: "ASSIGNED", value: data.assigned },
          { name: "STARTED", value: data.started },
          { name: "RESOLVED", value: data.resolved },
          { name: "CLOSED", value: data.closed },
        ];
      } else if (tab === "monthly") {
        formatted = data.map((item: any) => ({
          name: new Date(item.month).toLocaleString("default", {
            month: "short",
          }),
          value: item.count,
        }));
      } else if (tab === "client") {
        formatted = data.map((item: any) => ({
          name: item.client__user__username,
          value: item.count,
        }));
      } else if (tab === "staff") {
        formatted = data.map((item: any) => ({
          name: item.assigned_to__user__username || "Unassigned",
          value: item.count,
        }));
      }

      setChartData(formatted);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-slate-800">
        Dashboard Analytics
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 flex-wrap">
        <Tab label="Status" value="status" activeTab={activeTab} setActiveTab={setActiveTab} />
        <Tab label="Monthly" value="monthly" activeTab={activeTab} setActiveTab={setActiveTab} />

        {(role === "STAFF" || role === "ADMIN") && (
          <Tab label="Client Wise" value="client" activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {role === "ADMIN" && (
          <Tab label="Staff Wise" value="staff" activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>

      {/* Chart */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        {loading ? (
          <div className="text-slate-500">Loading analytics...</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function Tab({
  label,
  value,
  activeTab,
  setActiveTab,
}: {
  label: string;
  value: string;
  activeTab: string;
  setActiveTab: (val: string) => void;
}) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 rounded-xl font-medium transition ${
        activeTab === value
          ? "bg-indigo-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-indigo-100"
      }`}
    >
      {label}
    </button>
  );
}