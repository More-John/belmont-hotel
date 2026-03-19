"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import roomLuxury from "@/assets/room-luxury.jpg";
import roomJunior from "@/assets/room-junior.jpg";
import roomEconomy from "@/assets/room-economy.jpg";

const rooms = [
    {
        id: "executive",
        label: "EXECUTIVE",
        desc: "1 extra-large double bed. \n The suite features 1 bedroom and 1 bathroom with a bath and free toiletries. The air-conditioned suite provides a flat-screen TV with cable channels, a wardrobe, an electric kettle and a sofa.",
        image: roomLuxury,
    },
    {
        id: "deluxe-double",
        label: "DELUXE DOUBLE",
        desc: "1 large double bed. The spacious double room features air conditioning, a wardrobe, as well as a private bathroom boasting a bath. This double room offers an electric kettle and a flat-screen TV with cable channels",
        image: roomJunior,
    },
    {
        id: "one-bedroom",
        label: "ONE-BEDROOM",
        desc: "Simpler than the standard room but with all the necessary amenities. Every room is simply furnished and decorated and equipped with Air Conditioning, a TV and a private bathroom.",
        image: roomEconomy,
    },
];

export function RoomsSection() {
    const [activeIdx, setActiveIdx] = useState(0);
    const room = rooms[activeIdx];

    return (
        <section
            id="rooms"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${room.image.src})` }}
            />
            <div className="absolute inset-0 bg-hotel-black/60" />

            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
                <button
                    onClick={() => setActiveIdx((activeIdx - 1 + rooms.length) % rooms.length)}
                    className="text-hotel-gold hover:text-hotel-white transition-colors pointer-events-auto p-2"
                    aria-label="Previous room"
                >
                    <ChevronLeft className="w-10 h-10 md:w-12 md:h-12" />
                </button>
                <button
                    onClick={() => setActiveIdx((activeIdx + 1) % rooms.length)}
                    className="text-hotel-gold hover:text-hotel-white transition-colors pointer-events-auto p-2"
                    aria-label="Next room"
                >
                    <ChevronRight className="w-10 h-10 md:w-12 md:h-12" />
                </button>
            </div>

            {/* Content Container */}
            <div className="relative z-10 text-center px-4 max-w-3xl w-full">
                {/* Tab navigation */}
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
                    {rooms.map((r, i) => (
                        <button
                            key={r.id}
                            onClick={() => setActiveIdx(i)}
                            className={`font-body text-xs md:text-sm tracking-[0.2em] transition-colors ${i === activeIdx ? "text-hotel-gold" : "text-hotel-white"
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                <h3 className="font-display text-4xl md:text-5xl text-hotel-white tracking-wider mb-6 transition-all duration-300">
                    {room.label}
                </h3>

                <p className="font-body text-hotel-white/80 max-w-2xl mx-auto mb-10 leading-relaxed min-h-[80px]">
                    {room.desc}
                </p>

                <a
                    href="#reservation"
                    className="inline-block border-2 border-hotel-gold text-hotel-white font-body tracking-[0.3em] text-sm px-10 py-4 hover:bg-hotel-gold hover:text-hotel-black transition-colors"
                >
                    MAKE A RESERVATION
                </a>
            </div>
        </section>
    );
}