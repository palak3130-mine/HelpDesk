"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";

interface Issue {
  id: number;
  name: string;
}

interface SubIssue {
  id: number;
  name: string;
  issue: number;
}

export default function CreateTicketPage() {
  const router = useRouter();

  const [issues, setIssues] = useState<Issue[]>([]);
  const [subIssues, setSubIssues] = useState<SubIssue[]>([]);
  const [filteredSubIssues, setFilteredSubIssues] = useState<SubIssue[]>([]);

  const [issueId, setIssueId] = useState("");
  const [subIssueId, setSubIssueId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    apiGet("/api/issues/").then(setIssues);
    apiGet("/api/subissues/").then(setSubIssues);
  }, []);

  useEffect(() => {
    const filtered = subIssues.filter(
      (sub) => sub.issue === Number(issueId)
    );
    setFilteredSubIssues(filtered);
    setSubIssueId("");
  }, [issueId, subIssues]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await apiPost("/api/tickets/create/", {
        issue: Number(issueId),
        sub_issue: Number(subIssueId),
        description,
      });

      router.push("/dashboard/tickets");
    } catch (error) {
      console.error(error);
      alert("Error creating ticket");
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-slate-700">
        Create New Ticket
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md space-y-6"
      >
        <div>
          <label className="block text-sm text-slate-600 mb-2">
            Issue
          </label>
          <select
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            required
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select Issue</option>
            {issues.map((issue) => (
              <option key={issue.id} value={issue.id}>
                {issue.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-2">
            Sub Issue
          </label>
          <select
            value={subIssueId}
            onChange={(e) => setSubIssueId(e.target.value)}
            required
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Select Sub Issue</option>
            {filteredSubIssues.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full p-3 border rounded-xl"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white p-3 rounded-xl"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
}