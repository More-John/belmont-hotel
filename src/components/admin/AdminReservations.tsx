"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { Eye, Trash2, ArrowLeft } from "lucide-react";

type Reservation = {
    id: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    persons: number;
    specialRequests: string | null;
    status: string; // "pending", "confirmed", "cancelled"
    createdAt: string;
};

export function AdminReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [selected, setSelected] = useState<Reservation | null>(null);
    const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
    const [loading, setLoading] = useState(true);
    const detailRef = useRef<HTMLDivElement>(null);

    const fetchReservations = async () => {
        try {
            const res = await fetch("/api/reservations");
            if (res.ok) {
                const data = await res.json();
                setReservations(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Failed to fetch reservations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleSelectReservation = (resv: Reservation) => {
        setSelected(resv);
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setTimeout(() => {
                detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 50);
        }
    };

    const updateStatus = async (resv: Reservation, newStatus: string) => {
        if (resv.status === newStatus) return;
        const res = await fetch(`/api/reservations?id=${resv.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            await fetchReservations();
            if (selected?.id === resv.id) setSelected({ ...resv, status: newStatus });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this reservation?")) return;
        const res = await fetch(`/api/reservations?id=${id}`, { method: "DELETE" });
        if (res.ok) {
            await fetchReservations();
            if (selected?.id === id) setSelected(null);
        }
    };

    const filteredReservations = reservations.filter((r) => {
        if (filter === "all") return true;
        return r.status === filter;
    });

    const pendingCount = reservations.filter((r) => r.status === "pending").length;

    if (loading) return <div className="p-8 text-center font-body text-sm text-muted-foreground">Loading reservations...</div>;

    return (
        <div className="w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div>
                    <h1 className="font-display text-xl sm:text-2xl text-foreground tracking-wider">Reservations</h1>
                    {pendingCount > 0 && (
                        <p className="font-body text-sm text-hotel-gold mt-1">{pendingCount} pending</p>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
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
                    {filteredReservations.length === 0 && (
                        <p className="font-body text-sm text-muted-foreground p-6 text-center">No reservations found.</p>
                    )}
                    {filteredReservations.map((resv) => (
                        <div
                            key={resv.id}
                            className={`px-4 sm:px-5 py-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                                selected?.id === resv.id ? "bg-muted" : ""
                            } ${resv.status === "pending" ? "border-l-2 border-l-hotel-gold" : ""}`}
                            onClick={() => handleSelectReservation(resv)}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className={`font-body text-sm truncate ${resv.status === "pending" ? "font-bold text-foreground" : "text-foreground"}`}>
                                        {resv.guestName}{" "}
                                        <span className="text-muted-foreground font-normal text-xs">({resv.roomType})</span>
                                    </p>
                                    <p className="font-body text-xs text-muted-foreground truncate mt-0.5">
                                        In: {format(new Date(resv.checkIn), "MMM d")} – Out: {format(new Date(resv.checkOut), "MMM d")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`font-body text-[10px] uppercase px-2.5 py-0.5 rounded-full ${
                                        resv.status === "confirmed"
                                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                            : resv.status === "cancelled"
                                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                            : "bg-hotel-gold/10 text-hotel-gold border border-hotel-gold/20"
                                    }`}>
                                        {resv.status}
                                    </span>
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

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                                <div className="min-w-0">
                                    <h2 className="font-display text-lg sm:text-xl text-foreground break-words">{selected.guestName}</h2>
                                    <p className="font-body text-sm text-muted-foreground break-all mt-0.5">{selected.guestEmail}</p>
                                    <p className="font-body text-sm text-muted-foreground mt-0.5">{selected.guestPhone}</p>
                                </div>
                                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                                    <span className="font-body text-xs text-muted-foreground">
                                        Booked: {new Date(selected.createdAt).toLocaleDateString()}
                                    </span>
                                    <select
                                        value={selected.status}
                                        onChange={(e) => updateStatus(selected, e.target.value)}
                                        className="bg-muted border border-border text-foreground px-3 py-2 min-h-[40px] font-body text-base sm:text-xs focus:outline-none focus:border-hotel-gold capitalize"
                                        title="Update Status"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 border-y border-border py-4 mb-4">
                                <div>
                                    <p className="font-body text-xs text-muted-foreground mb-0.5">Room Type</p>
                                    <p className="font-body text-sm font-medium text-foreground">{selected.roomType}</p>
                                </div>
                                <div>
                                    <p className="font-body text-xs text-muted-foreground mb-0.5">Guests</p>
                                    <p className="font-body text-sm font-medium text-foreground">{selected.persons} Person(s)</p>
                                </div>
                                <div>
                                    <p className="font-body text-xs text-muted-foreground mb-0.5">Check In</p>
                                    <p className="font-body text-sm text-foreground">{format(new Date(selected.checkIn), "PPP")}</p>
                                </div>
                                <div>
                                    <p className="font-body text-xs text-muted-foreground mb-0.5">Check Out</p>
                                    <p className="font-body text-sm text-foreground">{format(new Date(selected.checkOut), "PPP")}</p>
                                </div>
                            </div>

                            {selected.specialRequests && (
                                <div className="mb-6">
                                    <p className="font-body text-xs text-muted-foreground mb-1">Special Requests</p>
                                    <p className="font-body text-sm text-foreground leading-relaxed break-words">
                                        {selected.specialRequests}
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                                <a
                                    href={`mailto:${selected.guestEmail}?subject=Reservation Update: Belmont Hotel`}
                                    className="w-full sm:w-auto text-center bg-hotel-gold text-hotel-black font-body font-bold tracking-[0.15em] text-xs px-5 py-3 min-h-[44px] flex items-center justify-center hover:bg-hotel-gold-light transition-colors"
                                >
                                    CONTACT VIA EMAIL
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
                        <div className="flex items-center justify-center h-full min-h-[220px] sm:min-h-[300px]">
                            <div className="text-center">
                                <Eye className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="font-body text-sm text-muted-foreground">Tap a reservation above to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
