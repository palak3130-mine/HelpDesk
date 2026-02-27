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

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiGet("/api/issues/").then((data) => {
      setIssues(data.results || data);
    });

    apiGet("/api/subissues/").then((data) => {
      setSubIssues(data.results || data);
    });
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
    setLoading(true);

    try {
      await apiPost("/api/tickets/create/", {
        issue: Number(issueId),
        sub_issue: Number(subIssueId),
        description,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/tickets");
      }, 1000);
    } catch (error) {
      console.error(error);
      alert("Error creating ticket");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Create New Ticket
        </h1>
        <p className="text-slate-500 mt-2">
          Submit your issue and our team will assist you promptly.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 space-y-8"
      >
        {/* Issue Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Issue Category
          </label>
          <select
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            required
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
          >
            <option value="">Select Issue</option>
            {issues.map((issue) => (
              <option key={issue.id} value={issue.id}>
                {issue.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Issue */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Sub Category
          </label>
          <select
            value={subIssueId}
            onChange={(e) => setSubIssueId(e.target.value)}
            required
            disabled={!issueId}
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Sub Issue</option>
            {filteredSubIssues.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            placeholder="Describe your issue in detail..."
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition resize-none"
          />
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm">
            Ticket created successfully! Redirecting...
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-xl text-white font-medium transition ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
}