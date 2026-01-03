"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
    const [accountId, setAccountId] = useState("");
    const [password, setPassword] = useState("");

    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [remembered, setRemembered] = useState(false);

    useEffect(() => {
        const rememberedId = localStorage.getItem("rememberedAccountId");
        if (rememberedId) {
            setAccountId(rememberedId);
            setRemembered(true);
        }
    }, [])


    function handleRememberChange(checked: boolean) {
        setRemembered(checked);
        if (checked) {
            localStorage.setItem("rememberedAccountId", accountId);
        } else {
            localStorage.removeItem("rememberedAccountId");
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if(remembered) {
            localStorage.setItem("rememberedAccountId", accountId);
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId, password }),
            });
            console.log("Response:", res);
            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as { message?: string } | null;
                throw new Error(data?.message || "Login failed. Please check your details.");
            }
            // 로그인 성공 후 이동 (필요한 경로로 바꿔도 됨)
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            {/* subtle background */}
            <div className="pointer-events-none absolute inset-0 opacity-60">
                <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-800 blur-3xl" />
                <div className="absolute bottom-[-120px] left-10 h-72 w-72 rounded-full bg-slate-800 blur-3xl" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-md items-center px-5">
                <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
                        <p className="mt-1 text-sm text-slate-300">
                            Vendor ordering dashboard (private).
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-200">
                                Account ID
                            </label>
                            <input
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                placeholder="e.g. Account"
                                autoComplete="username"
                                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-slate-600 focus:bg-slate-950"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-200">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPw ? "text" : "password"}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 pr-12 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-slate-600 focus:bg-slate-950"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw((v) => !v)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-slate-100"
                                    aria-label={showPw ? "Hide password" : "Show password"}
                                >
                                    {showPw ? "Hide" : "Show"}
                                </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs text-slate-400">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-slate-200 focus:ring-0"
                                        checked={remembered}
                                        onChange={(e)=> handleRememberChange(e.target.checked)}
                                    />
                                    Remember me
                                </label>

                                {/* <a
                                    href="/change-password"
                                    className="text-xs text-slate-300 underline-offset-4 hover:underline"
                                >
                                    Change password
                                </a> */}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !accountId || !password}
                            className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>

                        <p className="pt-2 text-center text-xs text-slate-400">
                            Tip: Keep this link private. No public registration.
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}
