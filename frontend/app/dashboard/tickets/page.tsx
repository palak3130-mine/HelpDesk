"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Ticket {
  id: number;
  ticket_number: string;
  status: string;
  description: string;
  created_at: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    apiGet("/api/tickets/")
      .then((data) => {
        setTickets(data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-lg">
        Loading tickets...
      </div>
    );

  if (!tickets.length)
    return (
      <div className="bg-white rounded-3xl shadow-md p-16 text-center border border-slate-100">
        <div className="text-5xl mb-4">📭</div>
        <h2 className="text-xl font-semibold text-slate-700">
          No tickets found
        </h2>
        <p className="text-slate-400 mt-2">
          Once tickets are created, they will appear here.
        </p>
      </div>
    );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Ticket Management
        </h1>
        <p className="text-slate-500 mt-2">
          View, monitor and manage support requests efficiently.
        </p>
      </div>

      {/* Ticket Cards */}
      <div className="grid gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() =>
              router.push(`/dashboard/tickets/${ticket.id}`)
            }
            className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs tracking-wider text-slate-400 uppercase">
                  Ticket #{typeof ticket.ticket_number === 'string' && ticket.ticket_number.includes('-')
                    ? ticket.ticket_number.split('-')[0]
                    : String(ticket.ticket_number).slice(0, 8)}
                </p>

                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                  {ticket.description.length > 80
                    ? ticket.description.slice(0, 80) + "..."
                    : ticket.description}
                </h3>
              </div>

              <StatusBadge status={ticket.status} />
            </div>

            <div className="mt-6 flex justify-between items-center text-xs text-slate-400">
              <span>
                Created on{" "}
                {new Date(ticket.created_at).toLocaleDateString()}
              </span>

              <span className="opacity-0 group-hover:opacity-100 transition text-indigo-500 font-medium">
                View →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base =
    "px-3 py-1 text-xs font-semibold rounded-full";

  const styles: Record<string, string> = {
    CREATED: "bg-blue-100 text-blue-700",
    ASSIGNED: "bg-purple-100 text-purple-700",
    STARTED: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`${base} ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}