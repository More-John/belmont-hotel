"use client";

import { useEffect, useState } from "react";
import { Image, MessageSquare, CalendarDays, Newspaper } from "lucide-react";

type Inquiry = {
    id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: string;
    status: string;
};

type Reservation = {
    id: string;
    guestName: string;
    guestEmail: string;
    checkIn: string;
    checkOut: string;
    roomType: string;
    status: string;
};

export function AdminOverview() {
    const [stats, setStats] = useState({
        totalImages: 0,
        newInquiries: 0,
        totalReservations: 0,
        totalPosts: 0,
    });
    const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
    const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper to format date without external libs
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateRange = (checkIn: string, checkOut: string) => {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        return `${inDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${outDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    };

    useEffect(() => {
        async function fetchDashboardData() {
            let images = [];
            let inquiries: Inquiry[] = [];
            let reservations: Reservation[] = [];

            // Fetch images (optional, if endpoint exists)
            try {
                const res = await fetch("/api/images");
                if (res.ok) images = await res.json();
            } catch (err) {
                console.error("Images fetch failed:", err);
            }

            // Fetch inquiries
            try {
                const res = await fetch("/api/inquiries");
                if (res.ok) inquiries = await res.json();
            } catch (err) {
                console.error("Inquiries fetch failed:", err);
            }

            // Fetch reservations
            try {
                const res = await fetch("/api/reservations");
                if (res.ok) reservations = await res.json();
            } catch (err) {
                console.error("Reservations fetch failed:", err);
            }

            let postsCount = 0;
            try {
                const res = await fetch("/api/posts");
                if (res.ok) {
                    const postsData = await res.json();
                    postsCount = postsData.length;
                }
            } catch (err) {
                console.error("Posts fetch failed:", err);
            }

            const unreadInquiries = inquiries.filter((i) => i.status === "unread");
            const latestInquiries = inquiries.slice(0, 5);
            const latestReservations = reservations.slice(0, 5);

            setStats({
                totalImages: images.length,
                newInquiries: unreadInquiries.length,
                totalReservations: reservations.length,
                totalPosts: postsCount,
            });
            setRecentInquiries(latestInquiries);
            setRecentReservations(latestReservations);
            setLoading(false);
        }

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center font-body text-sm text-muted-foreground">Loading dashboard...</div>;
    }

    return (
        <div className="w-full min-w-0">
            <h1 className="font-display text-xl sm:text-2xl text-foreground tracking-wider mb-4 sm:mb-6">
                Dashboard Overview
            </h1>

            {/* Stats Grid - 2x2 on phones, 4 columns on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-card border border-border p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <Image className="w-4 h-4 sm:w-5 sm:h-5 text-hotel-gold" />
                    </div>
                    <p className="font-display text-2xl sm:text-3xl text-foreground">{stats.totalImages}</p>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1 truncate">Total Images</p>
                </div>

                <div className="bg-card border border-border p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-hotel-gold" />
                    </div>
                    <p className="font-display text-2xl sm:text-3xl text-foreground">{stats.newInquiries}</p>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1 truncate">New Inquiries</p>
                </div>

                <div className="bg-card border border-border p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-hotel-gold" />
                    </div>
                    <p className="font-display text-2xl sm:text-3xl text-foreground">{stats.totalReservations}</p>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1 truncate">Reservations</p>
                </div>

                <div className="bg-card border border-border p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-hotel-gold" />
                    </div>
                    <p className="font-display text-2xl sm:text-3xl text-foreground">{stats.totalPosts}</p>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1 truncate">Updates & Blogs</p>
                </div>
            </div>

            {/* Recent Inquiries */}
            <div className="bg-card border border-border mb-6 sm:mb-8">
                <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border">
                    <h2 className="font-display text-base sm:text-lg text-foreground tracking-wider">
                        Recent Inquiries
                    </h2>
                </div>
                <div className="divide-y divide-border">
                    {recentInquiries.length === 0 ? (
                        <div className="px-4 sm:px-5 py-4 font-body text-sm text-muted-foreground">No inquiries yet.</div>
                    ) : (
                        recentInquiries.map((inq) => (
                            <div key={inq.id} className="px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="font-body text-sm font-bold text-foreground truncate">
                                        {inq.name}
                                    </p>
                                    <p className="font-body text-xs text-muted-foreground truncate">
                                        {inq.subject || "General Inquiry"}
                                    </p>
                                </div>
                                <p className="font-body text-xs text-muted-foreground shrink-0">
                                    {formatDate(inq.createdAt)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Recent Reservations */}
            <div className="bg-card border border-border">
                <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border">
                    <h2 className="font-display text-base sm:text-lg text-foreground tracking-wider">
                        Recent Reservations
                    </h2>
                </div>
                <div className="divide-y divide-border">
                    {recentReservations.length === 0 ? (
                        <div className="px-4 sm:px-5 py-4 font-body text-sm text-muted-foreground">No reservations yet.</div>
                    ) : (
                        recentReservations.map((res) => (
                            <div key={res.id} className="px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="font-body text-sm font-bold text-foreground truncate">
                                        {res.guestName}
                                    </p>
                                    <p className="font-body text-xs text-muted-foreground truncate">
                                        {res.roomType} • {formatDateRange(res.checkIn, res.checkOut)}
                                    </p>
                                </div>
                                <span className={`font-body text-[10px] uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                                    res.status === "confirmed"
                                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                        : res.status === "cancelled"
                                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                        : "bg-hotel-gold/10 text-hotel-gold border border-hotel-gold/20"
                                }`}>
                                    {res.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
