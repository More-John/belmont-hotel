"use client";

import { Image, MessageSquare, Eye, CalendarDays } from "lucide-react";

const stats = [
    { label: "Total Images", value: "24", icon: Image, color: "text-hotel-gold" },
    { label: "New Inquiries", value: "12", icon: MessageSquare, color: "text-hotel-gold" },
    { label: "Page Views (Today)", value: "1,284", icon: Eye, color: "text-hotel-gold" },
    { label: "Reservations", value: "8", icon: CalendarDays, color: "text-hotel-gold" },
];

const recentInquiries = [
    { name: "John Smith", email: "john@email.com", date: "2026-03-23", subject: "Room availability" },
    { name: "Sarah Johnson", email: "sarah@email.com", date: "2026-03-22", subject: "Event booking" },
    { name: "Mike Davis", email: "mike@email.com", date: "2026-03-22", subject: "Conference hall inquiry" },
];

export function AdminOverview() {
    return (
        <div>
            <h1 className="font-display text-2xl text-foreground tracking-wider mb-6">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-card border border-border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="font-display text-3xl text-foreground">{stat.value}</p>
                        <p className="font-body text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Inquiries */}
            <div className="bg-card border border-border">
                <div className="px-5 py-4 border-b border-border">
                    <h2 className="font-display text-lg text-foreground tracking-wider">Recent Inquiries</h2>
                </div>
                <div className="divide-y divide-border">
                    {recentInquiries.map((inq, i) => (
                        <div key={i} className="px-5 py-4 flex items-center justify-between">
                            <div>
                                <p className="font-body text-sm font-bold text-foreground">{inq.name}</p>
                                <p className="font-body text-xs text-muted-foreground">{inq.subject}</p>
                            </div>
                            <p className="font-body text-xs text-muted-foreground">{inq.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
