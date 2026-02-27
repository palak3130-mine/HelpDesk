"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        router.push("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-100 via-white to-slate-100">
      
      {/* Left Branding Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-16">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-indigo-700">
            HelpDesk SaaS
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-md">
            A smart, role-based ticket management system designed to streamline
            issue tracking, staff assignment, and resolution lifecycle with
            powerful analytics.
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-slate-100">
          <h2 className="text-3xl font-semibold text-slate-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-500 mb-8">
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm text-slate-600">Username</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Password</label>
              <input
                type="password"
                className="w-full mt-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-xl text-white font-medium transition ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}