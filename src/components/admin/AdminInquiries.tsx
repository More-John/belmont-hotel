"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: string; // "unread", "read", "archived"
    createdAt: string;
}

export function AdminInquiries() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [selected, setSelected] = useState<Inquiry | null>(null);
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
    const [loading, setLoading] = useState(true);

    const fetchInquiries = async () => {
        const res = await fetch("/api/inquiries");
        const data = await res.json();
        setInquiries(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const markAsRead = async (inq: Inquiry) => {
        if (inq.status === "read") return;
        const res = await fetch(`/api/inquiries?id=${inq.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "read" }),
        });
        if (res.ok) {
            await fetchInquiries();
            if (selected?.id === inq.id) setSelected({ ...inq, status: "read" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this inquiry?")) return;
        const res = await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
        if (res.ok) {
            await fetchInquiries();
            if (selected?.id === id) setSelected(null);
        }
    };

    const filteredInquiries = inquiries.filter((i) => {
        if (filter === "all") return true;
        if (filter === "unread") return i.status === "unread";
        return i.status === "read";
    });

    const unreadCount = inquiries.filter((i) => i.status === "unread").length;

    if (loading) return <div className="p-8 text-center">Loading inquiries...</div>;

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
                    {filteredInquiries.length === 0 && (
                        <p className="font-body text-sm text-muted-foreground p-6 text-center">No inquiries found.</p>
                    )}
                    {filteredInquiries.map((inq) => (
                        <div
                            key={inq.id}
                            className={`px-5 py-4 cursor-pointer transition-colors hover:bg-muted/50 ${selected?.id === inq.id ? "bg-muted" : ""
                                } ${inq.status === "unread" ? "border-l-2 border-l-hotel-gold" : ""}`}
                            onClick={() => {
                                markAsRead(inq);
                                setSelected(inq);
                            }}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className={`font-body text-sm ${inq.status === "unread" ? "font-bold text-foreground" : "text-foreground"}`}>
                                        {inq.name}
                                    </p>
                                    <p className="font-body text-xs text-muted-foreground truncate">{inq.message}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-body text-[10px] text-muted-foreground">
                                        {new Date(inq.createdAt).toLocaleDateString()}
                                    </span>
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
                                    <p className="font-body text-sm text-muted-foreground">{selected.phone || "No phone"}</p>
                                </div>
                                <span className="font-body text-xs text-muted-foreground">
                                    {new Date(selected.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="border-t border-border pt-4">
                                <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line">
                                    {selected.message}
                                </p>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <a
                                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
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