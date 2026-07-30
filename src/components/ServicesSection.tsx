"use client";

import { useState, useEffect } from "react";
import { UtensilsCrossed, Wine, PartyPopper, Presentation, ChefHat } from "lucide-react";


const defaultServices = [
    { icon: UtensilsCrossed, label: "RESTAURANT", image: "" },
    { icon: Wine, label: "MINI BAR", image: "" },
    { icon: PartyPopper, label: "EVENT CENTER", image: "" },
    { icon: Presentation, label: "CONFERENCE HALL", image: "" },
    { icon: ChefHat, label: "CATERING SERVICES", image: "" },
];

export function ServicesSection() {
    const [services, setServices] = useState(defaultServices);

    useEffect(() => {
        async function fetchImages() {
            try {
                const res = await fetch("/api/images");
                if (res.ok) {
                    const data = await res.json();
                    const serviceImages = data.filter((img: any) => img.section === "Services");
                    if (serviceImages.length > 0) {
                        setServices((prev) => prev.map(service => {
                            let targetLabel = "";
                            if (service.label === "RESTAURANT") targetLabel = "service-restaurant";
                            else if (service.label === "MINI BAR") targetLabel = "service-minibar";
                            else if (service.label === "EVENT CENTER") targetLabel = "service-event";
                            else if (service.label === "CONFERENCE HALL") targetLabel = "service-conference";
                            else if (service.label === "CATERING SERVICES") targetLabel = "service-catering";

                            const uploaded = serviceImages.find((img: any) => img.alt?.toLowerCase() === targetLabel);
                            
                            if (uploaded) {
                                return { ...service, image: uploaded.url };
                            }
                            return service;
                        }));
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchImages();
    }, []);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {services.map((s) => (
                    <div key={s.label} className="relative h-64 md:h-80 group overflow-hidden">
                        {s.image && <img src={s.image} alt={s.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-110 saturate-105 contrast-105" />}
                        <div className="absolute inset-0 bg-hotel-black/30 flex flex-col items-center justify-center gap-3">
                            <s.icon className="w-8 h-8 md:w-10 md:h-10 text-hotel-gold" strokeWidth={1.5} />
                            <span className="font-body text-xs md:text-sm tracking-[0.3em] text-hotel-white font-bold text-center px-2">
                                {s.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}