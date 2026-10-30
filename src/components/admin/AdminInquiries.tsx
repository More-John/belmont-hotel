"use client";

import { useEffect, useState, useRef } from "react";
import { Eye, Trash2, ArrowLeft } from "lucide-react";

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
    const detailRef = useRef<HTMLDivElement>(null);

    const fetchInquiries = async () => {
        try {
            const res = await fetch("/api/inquiries");
            if (res.ok) {
                const data = await res.json();
                setInquiries(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to fetch inquiries:", err);
        } finally {
            setLoading(false);
        }
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

    const handleSelectInquiry = (inq: Inquiry) => {
        markAsRead(inq);
        setSelected(inq);
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setTimeout(() => {
                detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 50);
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

    if (loading) return <div className="p-8 text-center font-body text-sm text-muted-foreground">Loading inquiries...</div>;

    return (
        <div className="w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div>
                    <h1 className="font-display text-xl sm:text-2xl text-foreground tracking-wider">Inquiries</h1>
                    {unreadCount > 0 && (
                        <p className="font-body text-sm text-hotel-gold mt-1">{unreadCount} unread</p>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(["all", "unread", "read"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`font-body text-xs tracking-wider px-3.5 py-2 min-h-[40px] border transition-colors capitalize ${
                                filter === f
                                    ? "border-hotel-gold bg-hotel-gold/10 text-hotel-gold font-semibold"
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
                <div className="w-full lg:w-1/2 bg-card border border-border divide-y divide-border max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">
                    {filteredInquiries.length === 0 && (
                        <p className="font-body text-sm text-muted-foreground p-6 text-center">No inquiries found.</p>
                    )}
                    {filteredInquiries.map((inq) => (
                        <div
                            key={inq.id}
                            className={`px-4 sm:px-5 py-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                                selected?.id === inq.id ? "bg-muted" : ""
                            } ${inq.status === "unread" ? "border-l-2 border-l-hotel-gold" : ""}`}
                            onClick={() => handleSelectInquiry(inq)}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className={`font-body text-sm truncate ${inq.status === "unread" ? "font-bold text-foreground" : "text-foreground"}`}>
                                        {inq.name}
                                    </p>
                                    <p className="font-body text-xs text-muted-foreground truncate mt-0.5">{inq.message}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="font-body text-[10px] text-muted-foreground">
                                        {new Date(inq.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(inq.id);
                                        }}
                                        className="text-muted-foreground hover:text-destructive transition-colors p-2 -mr-1"
                                        aria-label="Delete inquiry"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail Panel */}
                <div ref={detailRef} className="w-full lg:w-1/2 bg-card border border-border p-4 sm:p-6">
                    {selected ? (
                        <div>
                            <button
                                onClick={() => setSelected(null)}
                                className="lg:hidden flex items-center gap-1.5 text-xs font-body text-hotel-gold mb-4 py-1"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Clear selection
                            </button>

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-5">
                                <div className="min-w-0">
                                    <h2 className="font-display text-lg sm:text-xl text-foreground break-words">{selected.name}</h2>
                                    <p className="font-body text-sm text-muted-foreground break-all mt-0.5">{selected.email}</p>
                                    <p className="font-body text-sm text-muted-foreground mt-0.5">{selected.phone || "No phone"}</p>
                                    {selected.subject && (
                                        <p className="font-body text-xs text-hotel-gold mt-1">Subject: {selected.subject}</p>
                                    )}
                                </div>
                                <span className="font-body text-xs text-muted-foreground shrink-0">
                                    {new Date(selected.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="border-t border-border pt-4">
                                <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line break-words">
                                    {selected.message}
                                </p>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                                <a
                                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Inquiry at Belmont Hotel")}`}
                                    className="w-full sm:w-auto text-center bg-hotel-gold text-hotel-black font-body font-bold tracking-[0.15em] text-xs px-5 py-3 min-h-[44px] flex items-center justify-center hover:bg-hotel-gold-light transition-colors"
                                >
                                    REPLY VIA EMAIL
                                </a>
                                <button
                                    onClick={() => handleDelete(selected.id)}
                                    className="w-full sm:w-auto border border-destructive text-destructive font-body text-xs px-5 py-3 min-h-[44px] hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[200px]">
                            <div className="text-center">
                                <Eye className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="font-body text-sm text-muted-foreground">Tap an inquiry above to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
