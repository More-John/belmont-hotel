"use client";

import { useState } from "react";
import { Eye, Trash2, X } from "lucide-react";

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    date: string;
    read: boolean;
}

const mockInquiries: Inquiry[] = [
    { id: "1", name: "John Smith", email: "john@email.com", phone: "+2348050278001", message: "I would like to know about room availability for the executive suite from April 5-10. We are a party of 2 adults and 1 child.", date: "2026-03-23", read: false },
    { id: "2", name: "Sarah Johnson", email: "sarah@email.com", phone: "+2347040278001", message: "We are planning a corporate event for 150 guests in May. Could you provide details about your event center capacity and catering options?", date: "2026-03-22", read: false },
    { id: "3", name: "Mike Davis", email: "mike@email.com", phone: "+2348063221232", message: "Interested in booking the conference hall for a 2-day seminar. What AV equipment is included?", date: "2026-03-22", read: true },
    { id: "4", name: "Emily Chen", email: "emily@email.com", phone: "+2348050278001", message: "Do you offer any wedding packages? Looking for a venue for approximately 200 guests in June.", date: "2026-03-21", read: true },
    { id: "5", name: "Robert Wilson", email: "robert@email.com", phone: "+2348050278001", message: "Can I get a quote for the deluxe double room for a week-long stay? Also interested in restaurant reservations.", date: "2026-03-20", read: true },
];

export function AdminInquiries() {
    const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
    const [selected, setSelected] = useState<Inquiry | null>(null);
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

    const filtered = filter === "all" ? inquiries : inquiries.filter((i) => (filter === "unread" ? !i.read : i.read));

    const handleRead = (inq: Inquiry) => {
        setInquiries(inquiries.map((i) => (i.id === inq.id ? { ...i, read: true } : i)));
        setSelected(inq);
    };

    const handleDelete = (id: string) => {
        setInquiries(inquiries.filter((i) => i.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    const unreadCount = inquiries.filter((i) => !i.read).length;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-2xl text-foreground tracking-wider">Inquiries</h1>
                    {unreadCount > 0 && (
                        <p className="font-body text-sm text-hotel-gold mt-1">{unreadCount} unread</p>
                    )}
                </div>
                <div className="flex gap-2">
                    {(["all", "unread", "read"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`font-body text-xs tracking-wider px-4 py-2 border transition-colors capitalize ${filter === f
                                ? "border-hotel-gold bg-hotel-gold/10 text-hotel-gold"
                                : "border-border text-muted-foreground hover:border-foreground"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* List */}
                <div className="lg:w-1/2 bg-card border border-border divide-y divide-border max-h-[70vh] overflow-auto">
                    {filtered.length === 0 && (
                        <p className="font-body text-sm text-muted-foreground p-6 text-center">No inquiries found.</p>
                    )}
                    {filtered.map((inq) => (
                        <div
                            key={inq.id}
                            className={`px-5 py-4 cursor-pointer transition-colors hover:bg-muted/50 ${selected?.id === inq.id ? "bg-muted" : ""
                                } ${!inq.read ? "border-l-2 border-l-hotel-gold" : ""}`}
                            onClick={() => handleRead(inq)}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className={`font-body text-sm ${!inq.read ? "font-bold text-foreground" : "text-foreground"}`}>
                                        {inq.name}
                                    </p>
                                    <p className="font-body text-xs text-muted-foreground truncate">{inq.message}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-body text-[10px] text-muted-foreground">{inq.date}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(inq.id);
                                        }}
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                        aria-label="Delete inquiry"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail Panel */}
                <div className="lg:w-1/2 bg-card border border-border p-6">
                    {selected ? (
                        <div>
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="font-display text-xl text-foreground">{selected.name}</h2>
                                    <p className="font-body text-sm text-muted-foreground">{selected.email}</p>
                                    <p className="font-body text-sm text-muted-foreground">{selected.phone}</p>
                                </div>
                                <span className="font-body text-xs text-muted-foreground">{selected.date}</span>
                            </div>
                            <div className="border-t border-border pt-4">
                                <p className="font-body text-sm text-foreground leading-relaxed">{selected.message}</p>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <a
                                    href={`mailto:${selected.email}`}
                                    className="bg-hotel-gold text-hotel-black font-body font-bold tracking-[0.15em] text-xs px-5 py-2.5 hover:bg-hotel-gold-light transition-colors"
                                >
                                    REPLY VIA EMAIL
                                </a>
                                <button
                                    onClick={() => handleDelete(selected.id)}
                                    className="border border-destructive text-destructive font-body text-xs px-5 py-2.5 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[200px]">
                            <div className="text-center">
                                <Eye className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="font-body text-sm text-muted-foreground">Select an inquiry to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
