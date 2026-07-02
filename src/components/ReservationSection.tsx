"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ReservationSection() {
    const [form, setForm] = useState({
        name: "", email: "", phone: "", roomType: "", checkIn: "", checkOut: "", persons: "",
    });
    const [loading, setLoading] = useState(false); // ✅ added loading state

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Use form state values directly instead of FormData to avoid mismatched field names
        const data = {
            guestName: form.name,
            guestEmail: form.email,
            guestPhone: form.phone,
            roomType: form.roomType,
            checkIn: form.checkIn,
            checkOut: form.checkOut,
            persons: Number(form.persons),
        };

        try {
            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                toast.success("Reservation request sent! We'll contact you soon.");
                // Reset form
                setForm({
                    name: "", email: "", phone: "", roomType: "", checkIn: "", checkOut: "", persons: "",
                });
            } else {
                const error = await res.json();
                toast.error(error.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <section id="reservation" className="bg-hotel-black py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <h2 className="font-display text-3xl md:text-5xl text-hotel-white tracking-wider text-center mb-12">
                    RESERVATION
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required
                            className="bg-transparent border border-hotel-white/60 text-hotel-white placeholder:text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white" />
                        <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} required
                            className="bg-transparent border border-hotel-white/60 text-hotel-white placeholder:text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white" />
                        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required
                            className="bg-transparent border border-hotel-white/60 text-hotel-white placeholder:text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select name="roomType" aria-label="Room type" value={form.roomType} onChange={handleChange} required
                            className="bg-transparent border border-hotel-white/60 text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white">
                            <option value="" className="text-hotel-black">Room type</option>
                            <option value="executive" className="text-hotel-black">Executive</option>
                            <option value="deluxe-double" className="text-hotel-black">Deluxe Double</option>
                            <option value="one-bedroom" className="text-hotel-black">One-Bedroom</option>
                        </select>

                        <div className="relative w-full">
                            <input
                                name="checkIn"
                                type="date"
                                aria-label="Check-in date"
                                value={form.checkIn}
                                onChange={handleChange}
                                required
                                className={`w-full bg-transparent border border-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white ${form.checkIn ? 'text-hotel-white/60' : 'text-transparent'} [color-scheme:dark]`}
                            />
                            {!form.checkIn && (
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-hotel-white/60 pointer-events-none font-body">
                                    Check-in date
                                </span>
                            )}
                        </div>

                        <div className="relative w-full">
                            <input
                                name="checkOut"
                                type="date"
                                aria-label="Check-out date"
                                value={form.checkOut}
                                onChange={handleChange}
                                required
                                className={`w-full bg-transparent border border-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white ${form.checkOut ? 'text-hotel-white/60' : 'text-transparent'} [color-scheme:dark]`}
                            />
                            {!form.checkOut && (
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-hotel-white/60 pointer-events-none font-body">
                                    Check-out date
                                </span>
                            )}
                        </div>

                        <select name="persons" aria-label="Persons" value={form.persons} onChange={handleChange} required
                            className="bg-transparent border border-hotel-white/60 text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white">
                            <option value="" className="text-hotel-black">Persons</option>
                            <option value="1" className="text-hotel-black">1</option>
                            <option value="2" className="text-hotel-black">2</option>
                            <option value="3" className="text-hotel-black">3</option>
                            <option value="4" className="text-hotel-black">4+</option>
                        </select>
                    </div>

                    <div className="text-center">
                        <button type="submit" disabled={loading}
                            className="bg-hotel-white text-hotel-black font-body tracking-[0.3em] text-sm px-10 py-4 hover:bg-hotel-dark transition-colors disabled:opacity-50">
                            {loading ? "SENDING..." : "RESERVE NOW"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}