"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, BedDouble, Image as ImageIcon, MessageSquare, CalendarDays, Newspaper, LogOut, Menu, X } from "lucide-react";
import NextImage from "next/image";
import logo from "@/assets/belmont-logo.png";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminRooms } from "@/components/admin/AdminRooms";
import { AdminImages } from "@/components/admin/AdminImages";
import { AdminInquiries } from "@/components/admin/AdminInquiries";
import { AdminReservations } from "@/components/admin/AdminReservations";
import { AdminPosts } from "@/components/admin/AdminPosts";

type Tab = "overview" | "rooms" | "images" | "inquiries" | "reservations" | "posts";

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "rooms", label: "Rooms & Pricing", icon: BedDouble },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare },
    { id: "reservations", label: "Reservations", icon: CalendarDays },
    { id: "posts", label: "Updates & Blog", icon: Newspaper },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("admin_logged_in")) {
            router.push("/admin/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("admin_logged_in");
        router.push("/admin/login");
    };

    return (
        <div className="min-h-[100dvh] bg-muted flex flex-col md:flex-row w-full max-w-full overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 shrink-0 bg-hotel-dark border-r border-border min-h-screen sticky top-0 h-screen">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-border/30">
                    <NextImage src={logo} alt="Belmont Hotel" className="h-10 w-auto" priority />
                    <div>
                        <p className="font-display text-hotel-white text-sm tracking-wider">BELMONT</p>
                        <p className="font-body text-hotel-white/50 text-[10px] tracking-widest">ADMIN</p>
                    </div>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 font-body text-sm transition-colors ${
                                activeTab === item.id
                                    ? "bg-hotel-gold/20 text-hotel-gold border-l-2 border-hotel-gold"
                                    : "text-hotel-white/70 hover:text-hotel-white hover:bg-hotel-black/30"
                            }`}
                        >
                            <item.icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-7 py-4 font-body text-sm text-hotel-white/50 hover:text-destructive transition-colors border-t border-border/30"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sign Out
                </button>
            </aside>

            {/* Mobile Top Header + Scrollable Tab Bar */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-hotel-dark border-b border-border/30 shadow-md">
                <div className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <NextImage src={logo} alt="Belmont Hotel" className="h-7 w-auto shrink-0" />
                        <span className="font-display text-hotel-white text-sm tracking-wider truncate">
                            BELMONT ADMIN
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleLogout}
                            className="text-hotel-white/60 hover:text-destructive p-2 transition-colors"
                            aria-label="Sign out"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-hotel-white p-2 -mr-1 focus:outline-none"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Quick Mobile Horizontal Scroll Pill Bar */}
                <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar border-t border-border/20 bg-hotel-black/40">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setMobileMenuOpen(false);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs whitespace-nowrap transition-colors shrink-0 ${
                                activeTab === item.id
                                    ? "bg-hotel-gold text-hotel-black font-semibold shadow-sm"
                                    : "text-hotel-white/70 hover:text-hotel-white bg-hotel-dark/80 border border-border/30"
                            }`}
                        >
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Mobile Fullscreen Drawer Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-hotel-dark/95 pt-28 px-4 pb-6 overflow-y-auto">
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded font-body text-sm transition-colors ${
                                    activeTab === item.id
                                        ? "bg-hotel-gold/20 text-hotel-gold border-l-2 border-hotel-gold font-semibold"
                                        : "text-hotel-white/80 hover:bg-white/5"
                                }`}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3.5 font-body text-sm text-rose-400 hover:text-rose-300 mt-4 border-t border-border/30 pt-5"
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            Sign Out
                        </button>
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 w-full min-w-0 max-w-full px-3 sm:px-6 md:p-8 pt-28 md:pt-8 pb-10 overflow-x-hidden">
                {activeTab === "overview" && <AdminOverview />}
                {activeTab === "rooms" && <AdminRooms />}
                {activeTab === "images" && <AdminImages />}
                {activeTab === "inquiries" && <AdminInquiries />}
                {activeTab === "reservations" && <AdminReservations />}
                {activeTab === "posts" && <AdminPosts />}
            </main>
        </div>
    );
}
