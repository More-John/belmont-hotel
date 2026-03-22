"use client";

import { UtensilsCrossed, Wine, PartyPopper, Presentation } from "lucide-react";
import restaurantImg from "@/assets/service-restaurant.jpg";
import minibarImg from "@/assets/service-minibar.jpg";
import eventImg from "@/assets/service-event.jpg";
import conferenceImg from "@/assets/service-conference.jpg";

const services = [
    { icon: UtensilsCrossed, label: "RESTAURANT", image: restaurantImg },
    { icon: Wine, label: "MINI BAR", image: minibarImg },
    { icon: PartyPopper, label: "EVENT CENTER", image: eventImg },
    { icon: Presentation, label: "CONFERENCE HALL", image: conferenceImg },
];

export function ServicesSection() {
    return (
        <section id="services">
            {/* Text area */}
            <div className="bg-hotel-black py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-3xl md:text-5xl text-hotel-white tracking-wider mb-6">
                        ADDITIONAL SERVICES
                    </h2>
                    <p className="font-body text-hotel-white/70 leading-relaxed">
                        With its convenient location, Belmont Hotel offers the perfect escape after a busy day.
                        Enjoy spectacular views and beautiful architecture, all complemented by relaxed,
                        welcoming service, delicious food, and an impeccable wine list. It is the ideal place to unwind.
                    </p>
                </div>
            </div>

            {/* Service cards */}
            <div className="grid grid-cols-1 md:grid-cols-4">
                {services.map((s) => (
                    <div key={s.label} className="relative h-64 md:h-80 group overflow-hidden">
                        <img src={s.image.src} alt={s.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-hotel-black/50 flex flex-col items-center justify-center gap-3">
                            <s.icon className="w-10 h-10 text-hotel-gold" strokeWidth={1.5} />
                            <span className="font-body text-sm tracking-[0.3em] text-hotel-white font-bold">
                                {s.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}