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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🔄 Fetching issues from /api/issues/...");
        const issuesData = await apiGet("/api/issues/");
        console.log("✅ Issues response:", issuesData);
        console.log("   Type:", typeof issuesData);
        console.log("   Is Array:", Array.isArray(issuesData));
        
        // Handle both array and paginated responses
        const issuesList = Array.isArray(issuesData) ? issuesData : (issuesData.results || []);
        console.log("📋 Issues list:", issuesList);
        console.log("   Count:", issuesList.length);
        setIssues(issuesList);

        console.log("Fetching sub-issues from /api/subissues/...");
        const subIssuesData = await apiGet("/api/subissues/");
        console.log("Sub-issues response:", subIssuesData);
        console.log("   Type:", typeof subIssuesData);
        console.log("   Is Array:", Array.isArray(subIssuesData));
        
        // Handle both array and paginated responses
        const subIssuesList = Array.isArray(subIssuesData) ? subIssuesData : (subIssuesData.results || []);
        console.log("📋 Sub-issues list:", subIssuesList);
        console.log("   Count:", subIssuesList.length);
        setSubIssues(subIssuesList);
        
        if (issuesList.length === 0) {
          const msg = "No issues available. Please create issues first in the admin panel.";
          console.error("⚠️", msg);
          setError(msg);
        } else {
          console.log("✨ Successfully loaded", issuesList.length, "issues and", subIssuesList.length, "sub-issues");
        }
      } catch (err: any) {
        console.error("❌ Fetch error:", err);
        console.error("   Message:", err.message);
        console.error("   Stack:", err.stack);
        setError(`Failed to load options: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = subIssues.filter(
      (sub) => String(sub.issue) === issueId
    );
    setFilteredSubIssues(filtered);
    setSubIssueId("");
  }, [issueId, subIssues]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await apiPost("/api/tickets/create/", {
        issue: issueId ? Number(issueId) : null,
        sub_issue: subIssueId ? Number(subIssueId) : null,
        description,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/tickets");
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setError(`Error creating ticket: ${error.message}`);
    } finally {
      setSubmitLoading(false);
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
      {loading ? (
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
          <div className="text-slate-500">Loading form options...</div>
          <div className="text-xs text-slate-400 mt-4">Check browser console (F12) for details</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-10 rounded-3xl shadow-xl border border-red-200">
          <div className="text-red-600 font-medium mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Debug Info */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-sm text-blue-700 mb-6">
            <p>✅ Loaded {issues.length} issues and {subIssues.length} sub-issues</p>
            <p className="text-xs text-blue-600 mt-2">Check browser console (F12) for full API response</p>
          </div>
          
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
              <option key={issue.id} value={String(issue.id)}>
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
              <option key={sub.id} value={String(sub.id)}>
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

        {/* Error Message */}
        {error && !loading && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitLoading || !issueId || !subIssueId}
          className={`w-full p-3 rounded-xl text-white font-medium transition ${
            submitLoading || !issueId || !subIssueId
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {submitLoading ? "Submitting..." : "Submit Ticket"}
        </button>
          </form>
        </>
      )}
    </div>
  );
}