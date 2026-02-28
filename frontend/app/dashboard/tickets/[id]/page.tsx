"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";

interface Ticket {
  id: number;
  ticket_number: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
  client: number;
  issue: number;
  sub_issue: number;
  assigned_to: number | null;
  client_name: string;
  client_email: string;
  company_name: string;
  client_phone: string;
  issue_name: string;
  sub_issue_name: string;
  assigned_staff: string | null;
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
  const router = useRouter();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allowedStatuses, setAllowedStatuses] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [eligibleStaff, setEligibleStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("user_role"));

    apiGet(`/api/tickets/${id}/`).then(setTicket);

    apiGet(`/api/tickets/${id}/activity/`).then((data) =>
      setActivities(data.results || data)
    );

    apiGet(`/api/tickets/${id}/allowed-transitions/`).then((data) => {
      setAllowedStatuses(data.allowed_statuses);
      setSelectedStatus(data.current_status);
    });

    apiGet(`/api/tickets/${id}/eligible-staff/`).then((data) =>
      setEligibleStaff(data.results || data)
    );
  }, [id]);

  async function updateTicket() {
    setLoadingUpdate(true);
    try {
      // Send the update
      const updateData: any = {
        status: selectedStatus,
      };
      
      if (selectedStaff) {
        updateData.assigned_to = parseInt(selectedStaff);
      }
      
      await apiPatch(`/api/tickets/${id}/update/`, updateData);

      // Refetch ticket data
      const updatedTicket = await apiGet(`/api/tickets/${id}/`);
      setTicket(updatedTicket);
      
      // Refetch activities
      const activitiesData = await apiGet(`/api/tickets/${id}/activity/`);
      setActivities(activitiesData.results || activitiesData);
      
      // Refetch allowed statuses
      const transitionsData = await apiGet(`/api/tickets/${id}/allowed-transitions/`);
      setAllowedStatuses(transitionsData.allowed_statuses);
      setSelectedStatus(transitionsData.current_status);
      
      // Reset selected staff
      setSelectedStaff("");
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to update ticket";
      alert(`Update failed: ${errorMsg}`);
      console.error("Update error:", err);
    } finally {
      setLoadingUpdate(false);
    }
  }

  if (!ticket)
    return (
      <div className="flex justify-center items-center h-64 text-slate-400 text-lg">
        Loading ticket details...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs tracking-wider uppercase text-slate-400">
            Ticket #{typeof ticket.ticket_number === 'string' && ticket.ticket_number.includes('-') 
              ? ticket.ticket_number.split('-')[0]
              : String(ticket.ticket_number).slice(0, 8)}
          </p>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">
            Support Request Details
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Full ID: {String(ticket.ticket_number)}
          </p>
        </div>

        <StatusBadge status={ticket.status} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

          {/* Description Card */}
          <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 space-y-6">
            <h2 className="text-lg font-semibold text-slate-700">
              Ticket Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

              <div>
                <p className="text-slate-400 uppercase text-xs">Company</p>
                <p className="text-slate-700 font-medium">
                  {ticket.company_name}
                </p>
              </div>

              <div>
                <p className="text-slate-400 uppercase text-xs">Client</p>
                <p className="text-slate-700 font-medium">
                  {ticket.client_name}
                </p>
              </div>

              <div>
                <p className="text-slate-400 uppercase text-xs">Email</p>
                <p className="text-slate-700 font-medium">
                 {ticket.client_email}
                </p>
             </div>

              <div>
                <p className="text-slate-400 uppercase text-xs">Phone</p>
                <p className="text-slate-700 font-medium">
                  {ticket.client_phone}
                </p>
              </div>

              <div>
                <p className="text-slate-400 uppercase text-xs">Issue</p>
                <p className="text-slate-700 font-medium">
                  {ticket.issue_name}
                </p>
              </div>

              <div>
                <p className="text-slate-400 uppercase text-xs">Sub Issue</p>
                <p className="text-slate-700 font-medium">
                  {ticket.sub_issue_name}
                </p>
              </div>

              <div>
                <p className="text-slate-400 uppercase text-xs">Assigned Staff</p>
                <p className="text-slate-700 font-medium">
                 {ticket.assigned_staff || "Not Assigned"}
                </p>
              </div>

            </div>

            <div className="pt-6 border-t">
              <p className="text-slate-400 uppercase text-xs mb-2">Description</p>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {ticket.description}
              </p>
           </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-700 mb-6">
              Activity Timeline
            </h2>

            <div className="relative border-l border-slate-200 pl-6 space-y-8">
              {activities.map((activity) => (
                <div key={activity.id} className="relative">
                  <div className="absolute -left-[10px] top-1 w-3 h-3 bg-indigo-600 rounded-full"></div>

                  <div className="text-sm text-slate-600">
                    <span className="font-semibold">
                      {activity.changed_by}
                    </span>{" "}
                    changed from{" "}
                    <span className="font-medium text-slate-700">
                      {activity.old_status}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-indigo-600">
                      {activity.new_status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        {role !== "CLIENT" && (
          <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 space-y-6 h-fit">
            <h2 className="text-lg font-semibold text-slate-700">
              Update Ticket
            </h2>

            <div className="space-y-4">
              <label className="text-xs text-slate-500 uppercase tracking-wide">
                Status
              </label>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value={ticket.status}>
                  {ticket.status}
                </option>

                {allowedStatuses
                  .filter((status) =>
                    role === "STAFF" ? status !== "CLOSED" : true
                  )
                  .map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-xs text-slate-500 uppercase tracking-wide">
                Assign Staff
              </label>

              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="">Select staff</option>
                {eligibleStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.username}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={updateTicket}
              disabled={loadingUpdate}
              className={`w-full p-3 rounded-xl text-white font-semibold transition ${
                loadingUpdate
                  ? "bg-indigo-300"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loadingUpdate ? "Updating..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base = "px-4 py-1 text-xs font-semibold rounded-full";

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