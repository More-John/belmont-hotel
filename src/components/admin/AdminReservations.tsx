"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";

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

    const fetchReservations = async () => {
        const res = await fetch("/api/reservations");
        const data = await res.json();
        setReservations(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchReservations();
    }, []);

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

    if (loading) return <div className="p-8 text-center">Loading reservations...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-2xl text-foreground tracking-wider">Reservations</h1>
                    {pendingCount > 0 && (
                        <p className="font-body text-sm text-hotel-gold mt-1">{pendingCount} pending</p>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
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
                    {filteredReservations.length === 0 && (
                        <p className="font-body text-sm text-muted-foreground p-6 text-center">No reservations found.</p>
                    )}
                    {filteredReservations.map((resv) => (
                        <div
                            key={resv.id}
                            className={`px-5 py-4 cursor-pointer transition-colors hover:bg-muted/50 ${selected?.id === resv.id ? "bg-muted" : ""
                                } ${resv.status === "pending" ? "border-l-2 border-l-hotel-gold" : ""}`}
                            onClick={() => setSelected(resv)}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className={`font-body text-sm ${resv.status === "pending" ? "font-bold text-foreground" : "text-foreground"}`}>
                                        {resv.guestName} <span className="text-muted-foreground font-normal">({resv.roomType})</span>
                                    </p>
                                    <p className="font-body text-xs text-muted-foreground truncate">
                                        In: {format(new Date(resv.checkIn), "MMM d")} - Out: {format(new Date(resv.checkOut), "MMM d")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`font-body text-[10px] uppercase px-2 py-0.5 rounded-full ${
                                        resv.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                        resv.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                        'bg-hotel-gold/10 text-hotel-gold border border-hotel-gold/20'
                                    }`}>
                                        {resv.status}
                                    </span>
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
                                    <h2 className="font-display text-xl text-foreground">{selected.guestName}</h2>
                                    <p className="font-body text-sm text-muted-foreground break-all">{selected.guestEmail}</p>
                                    <p className="font-body text-sm text-muted-foreground">{selected.guestPhone}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="font-body text-xs text-muted-foreground">
                                        Booked: {new Date(selected.createdAt).toLocaleDateString()}
                                    </span>
                                    <select
                                        value={selected.status}
                                        onChange={(e) => updateStatus(selected, e.target.value)}
                                        className="bg-muted border border-border text-foreground px-3 py-1 font-body text-base sm:text-xs focus:outline-none focus:border-hotel-gold capitalize"
                                        title="Update Status"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-y border-border py-4 mb-4">
                                <div>
                                    <p className="font-body text-xs text-muted-foreground mb-1">Room Type</p>
                                    <p className="font-body text-sm text-foreground">{selected.roomType}</p>
                                </div>
                                <div>
                                    <p className="font-body text-xs text-muted-foreground mb-1">Guests</p>
                                    <p className="font-body text-sm text-foreground">{selected.persons} Person(s)</p>
                                </div>
                                <div>
                                    <p className="font-body text-xs text-muted-foreground mb-1">Check In</p>
                                    <p className="font-body text-sm text-foreground">{format(new Date(selected.checkIn), "PPP")}</p>
                                </div>
                                <div>
                                    <p className="font-body text-xs text-muted-foreground mb-1">Check Out</p>
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

                            <div className="mt-6 flex gap-3">
                                <a
                                    href={`mailto:${selected.guestEmail}?subject=Reservation Update: Belmont Hotel`}
                                    className="bg-hotel-gold text-hotel-black font-body font-bold tracking-[0.15em] text-xs px-5 py-2.5 hover:bg-hotel-gold-light transition-colors"
                                >
                                    CONTACT VIA EMAIL
                                </a>
                                <button
                                    onClick={() => handleDelete(selected.id)}
                                    className="border border-destructive text-destructive font-body text-xs px-5 py-2.5 hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[300px]">
                            <div className="text-center">
                                <Eye className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="font-body text-sm text-muted-foreground">Select a reservation to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}