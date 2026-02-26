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
} from "recharts";

interface Summary {
  total_tickets: number;
  created: number;
  assigned: number;
  started: number;
  resolved: number;
  closed: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);

  useEffect(() => {
    apiGet("/api/dashboard/")
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <div>Loading...</div>;

  const chartData = [
    { name: "Created", value: data.created },
    { name: "Assigned", value: data.assigned },
    { name: "Started", value: data.started },
    { name: "Resolved", value: data.resolved },
    { name: "Closed", value: data.closed },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-slate-700">
        Dashboard Analytics
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}