"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/belmont-logo.png";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            localStorage.setItem("admin_logged_in", "true");
            router.push("/admin/dashboard");
        } else {
            setError("Please enter your email and password.");
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
                        <p className="text-destructive text-sm font-body text-center">{error}</p>
                    )}
                    <div>
                        <label htmlFor="email" className="block font-body text-hotel-white/70 text-sm mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            title="Enter your password"
                            className="w-full bg-hotel-black border border-border text-hotel-white placeholder:text-muted-foreground px-4 py-3 font-body text-sm focus:outline-none focus:border-hotel-gold"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-hotel-gold text-hotel-black font-body font-bold tracking-[0.2em] text-sm py-3.5 hover:bg-hotel-gold-light transition-colors"
                    >
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