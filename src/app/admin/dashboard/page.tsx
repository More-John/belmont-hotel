"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, MessageSquare, CalendarDays, LogOut, Menu, X } from "lucide-react";
import NextImage from "next/image";
import logo from "@/assets/belmont-logo.png";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminImages } from "@/components/admin/AdminImages";
import { AdminInquiries } from "@/components/admin/AdminInquiries";
import { AdminReservations } from "@/components/admin/AdminReservations";   // <-- import

type Tab = "overview" | "images" | "inquiries" | "reservations";   // <-- add "reservations"

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare },
    { id: "reservations", label: "Reservations", icon: CalendarDays },   // <-- new tab
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
        <div className="min-h-screen bg-muted flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-hotel-dark border-r border-border min-h-screen">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-border/30">
                    <NextImage src={logo} alt="Belmont Hotel" className="h-10 w-auto" priority />
                    <div>
                        <p className="font-display text-hotel-white text-sm tracking-wider">BELMONT</p>
                        <p className="font-body text-hotel-white/50 text-[10px] tracking-widest">ADMIN</p>
                    </div>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 font-body text-sm transition-colors ${activeTab === item.id
                                    ? "bg-hotel-gold/20 text-hotel-gold border-l-2 border-hotel-gold"
                                    : "text-hotel-white/70 hover:text-hotel-white hover:bg-hotel-black/30"
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-7 py-4 font-body text-sm text-hotel-white/50 hover:text-destructive transition-colors border-t border-border/30"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-hotel-dark border-b border-border/30 flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <NextImage src={logo} alt="Belmont Hotel" className="h-8 w-auto" />
                    <span className="font-display text-hotel-white text-sm tracking-wider">ADMIN</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-hotel-white">
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-hotel-dark/95 pt-16">
                    <nav className="px-4 py-6 space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 font-body text-sm transition-colors ${activeTab === item.id
                                        ? "bg-hotel-gold/20 text-hotel-gold"
                                        : "text-hotel-white/70"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 font-body text-sm text-hotel-white/50 hover:text-destructive mt-4 border-t border-border/30 pt-4"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </nav>
                </div>
            )}

            {/* Main Content – now includes Reservations */}
            <main className="flex-1 md:p-8 p-4 pt-20 md:pt-8 overflow-auto">
                {activeTab === "overview" && <AdminOverview />}
                {activeTab === "images" && <AdminImages />}
                {activeTab === "inquiries" && <AdminInquiries />}
                {activeTab === "reservations" && <AdminReservations />}   {/* <-- new */}
            </main>
        </div>
    );
}