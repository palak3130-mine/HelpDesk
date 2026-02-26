"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

interface Ticket {
  id: number;
  ticket_number: string;
  status: string;
  description: string;
  created_at: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    apiGet("/api/tickets/")
      .then((data) => setTickets(data.results))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-slate-700">
        Tickets
      </h1>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600 text-sm">
            <tr>
              <th className="p-4">Ticket</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-t hover:bg-slate-50 cursor-pointer"
                onClick={() =>
                  (window.location.href = `/dashboard/tickets/${ticket.id}`)
                }
              >
                <td className="p-4">
                  {ticket.ticket_number.slice(0, 8)}
                </td>
                <td className="p-4">{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}