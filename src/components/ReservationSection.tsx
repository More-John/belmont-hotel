"use client";

import { useState } from "react";

export function ReservationSection() {
    const [form, setForm] = useState({
        name: "", email: "", phone: "", roomType: "", checkIn: "", checkOut: "", persons: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <section id="reservation" className="bg-hotel-black py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <h2 className="font-display text-3xl md:text-5xl text-hotel-white tracking-wider text-center mb-12">
                    RESERVATION
                </h2>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
                            className="bg-transparent border border-hotel-white/60 text-hotel-white placeholder:text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white" />
                        <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange}
                            className="bg-transparent border border-hotel-white/60 text-hotel-white placeholder:text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white" />
                        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
                            className="bg-transparent border border-hotel-white/60 text-hotel-white placeholder:text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select name="roomType" aria-label="Room type" value={form.roomType} onChange={handleChange}
                            className="bg-transparent border border-hotel-white/60 text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white">
                            <option value="" className="text-hotel-black">Room type</option>
                            <option value="executive" className="text-hotel-black">Executive</option>
                            <option value="deluxe-double" className="text-hotel-black">Deluxe Double</option>
                            <option value="one-bedroom" className="text-hotel-black">One-Bedroom</option>
                        </select>
                        <input name="checkIn" type="date" placeholder="Check-in date" value={form.checkIn} onChange={handleChange}
                            className="bg-transparent border border-hotel-white/60 text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white" />
                        <input name="checkOut" type="date" placeholder="Check-out date" value={form.checkOut} onChange={handleChange}
                            className="bg-transparent border border-hotel-white/60 text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white" />
                        <select name="persons" aria-label="Persons" value={form.persons} onChange={handleChange}
                            className="bg-transparent border border-hotel-white/60 text-hotel-white/60 px-4 py-3 font-body focus:outline-none focus:border-hotel-white">
                            <option value="" className="text-hotel-black">Persons</option>
                            <option value="1" className="text-hotel-black">1</option>
                            <option value="2" className="text-hotel-black">2</option>
                            <option value="3" className="text-hotel-black">3</option>
                            <option value="4" className="text-hotel-black">4+</option>
                        </select>
                    </div>

                    <div className="text-center">
                        <button type="submit"
                            className="bg-hotel-white text-hotel-black font-body tracking-[0.3em] text-sm px-10 py-4 hover:bg-hotel-dark transition-colors">
                            RESERVE NOW
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}