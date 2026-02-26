"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";

interface Ticket {
  id: number;
  ticket_number: string;
  status: string;
  description: string;
  created_at: string;
}

interface Activity {
  id: number;
  old_status: string;
  new_status: string;
  changed_by: string;
  created_at: string;
}

interface Staff {
  id: number;
  username: string;
}

export default function TicketDetailPage() {
  const { id } = useParams();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allowedStatuses, setAllowedStatuses] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [eligibleStaff, setEligibleStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    apiGet(`/api/tickets/?search=${id}`).then((data) => {
      const found = data.results.find(
        (t: Ticket) => String(t.id) === String(id)
      );
      setTicket(found);
    });

    apiGet(`/api/tickets/${id}/activity/`).then(setActivities);

    apiGet(`/api/tickets/${id}/allowed-transitions/`).then((data) => {
      setAllowedStatuses(data.allowed_statuses);
      setSelectedStatus(data.current_status);
    });

    apiGet(`/api/tickets/${id}/eligible-staff/`).then(
      setEligibleStaff
    );
  }, [id]);

  async function updateTicket() {
    try {
      await apiPatch(`/api/tickets/${id}/update/`, {
        status: selectedStatus,
        assigned_to: selectedStaff || null,
      });

      location.reload();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="bg-white rounded-2xl shadow-md p-8 space-y-4">
        <h1 className="text-xl font-semibold text-slate-700">
          Ticket #{ticket.ticket_number.slice(0, 8)}
        </h1>

        <p className="text-slate-600">{ticket.description}</p>

        <div className="pt-6 border-t space-y-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value={ticket.status}>
              {ticket.status}
            </option>

            {allowedStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Assign Staff</option>
            {eligibleStaff.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.username}
              </option>
            ))}
          </select>

          <button
            onClick={updateTicket}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
          >
            Update
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-lg font-semibold mb-6">
          Activity Timeline
        </h2>

        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id}>
              <div className="text-sm">
                {activity.changed_by} changed from{" "}
                {activity.old_status} to{" "}
                <span className="text-indigo-600">
                  {activity.new_status}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {new Date(activity.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}