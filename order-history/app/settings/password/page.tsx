"use client";

import { useState } from "react";
import Link from "next/link";
import Spinner from "@/app/components/ui/Spinner";
import { changePasswordAction } from "@/server/actions/auth.action";

export default function PasswordSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const valid = validateForm();
    if (!valid) {
      setLoading(false);
      return;
    }

    try {
      const data = { currentPassword, newPassword, confirmPassword };
      const res = await changePasswordAction(data);

      if (!res.ok) {
        setMsg({ type: "err", text: "An error occurred while changing the password." });
      } else {
        setMsg({ type: "ok", text: "Password updated successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } finally {
      setLoading(false);
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include", 
      });

      // go to logout page to clear session cookie and redirect to login
      window.location.href = "/login";
    }
  }

  function validateForm() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsg({ type: "err", text: "All fields are required." });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ type: "err", text: "New password and confirm password do not match." });
      return false;
    }
    return true;
  }


  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold">Change password</h1>
            <p className="text-sm text-slate-500">Update your account password.</p>
          </div>

          <Link
            href="/settings"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          >
            ← Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-6">
        <section className="relative rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60">
              <Spinner />
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                autoComplete="current-password"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-slate-500">At least 8 characters.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                autoComplete="new-password"
              />
            </div>

            {msg && (
              <div
                className={[
                  "rounded-xl border px-3 py-2 text-sm",
                  msg.type === "ok"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800",
                ].join(" ")}
              >
                {msg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Update password
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}