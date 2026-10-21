"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/belmont-logo.png";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setSubmitting(true);
        try {
            // 1. Try API authentication endpoint
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmedEmail, password }),
            });

            if (res.ok) {
                localStorage.setItem("admin_logged_in", "true");
                router.push("/admin/dashboard");
                return;
            }

            // 2. Client-side fallback to NEXT_PUBLIC env variables
            const envEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "johnnyscreenpage1@gmail.com";
            const envPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "BelmontHotelAbuja";

            if (trimmedEmail.toLowerCase() === envEmail.toLowerCase() && password === envPass) {
                localStorage.setItem("admin_logged_in", "true");
                router.push("/admin/dashboard");
                return;
            }

            setError("Invalid email or password. Please try again.");
        } catch (err) {
            const envEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "johnnyscreenpage1@gmail.com";
            const envPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "BelmontHotelAbuja";

            if (trimmedEmail.toLowerCase() === envEmail.toLowerCase() && password === envPass) {
                localStorage.setItem("admin_logged_in", "true");
                router.push("/admin/dashboard");
                return;
            }
            setError("Invalid email or password.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-hotel-dark flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10">
                    <Image src={logo} alt="Belmont Hotel" className="h-20 w-auto" priority />
                    <h1 className="font-display text-2xl text-hotel-white tracking-wider">
                        ADMIN PANEL
                    </h1>
                    <p className="font-body text-hotel-white/60 text-sm mt-1">
                        Sign in to manage your hotel
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <p className="text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded px-3 py-2 text-sm font-body text-center">{error}</p>
                    )}
                    <div>
                        <label htmlFor="email" className="block font-body text-hotel-white/70 text-sm mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@belmonthotel.com"
                            title="Enter your email address"
                            className="w-full bg-hotel-black border border-border text-hotel-white placeholder:text-muted-foreground px-4 py-3 font-body text-sm focus:outline-none focus:border-hotel-gold"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block font-body text-hotel-white/70 text-sm mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            title="Enter your password"
                            className="w-full bg-hotel-black border border-border text-hotel-white placeholder:text-muted-foreground px-4 py-3 font-body text-sm focus:outline-none focus:border-hotel-gold"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-hotel-gold text-hotel-black font-body font-bold tracking-[0.2em] text-sm py-3.5 hover:bg-hotel-gold-light transition-colors flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        SIGN IN
                    </button>
                </form>

                <div className="text-center mt-6">
                    <a href="/" className="font-body text-hotel-white/50 text-xs hover:text-hotel-gold transition-colors">
                        ← Back to website
                    </a>
                </div>
            </div>
        </div>
    );
}
