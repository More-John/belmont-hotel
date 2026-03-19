"use client";

import { KeyRound, Coffee, Monitor, Wine, Wind, Wifi, Lock, User } from "lucide-react";

const amenities = [
  { icon: KeyRound, label: "RECEPTION" },
  { icon: Coffee, label: "BREAKFAST" },
  { icon: Monitor, label: "DIGITAL TV" },
  { icon: Wine, label: "MINI BAR" },
  { icon: Wind, label: "AIR CONDITIONING" },
  { icon: Wifi, label: "WI-FI" },
  { icon: Lock, label: "IN-ROOM SAFE" },
  { icon: User, label: "HOUSEKEEPING" },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-hotel-gold py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-5xl text-hotel-white tracking-wider mb-6">
          LUXURY HOTEL THAT WILL LET YOU STEP INTO CELEBRITIES' SLIPPERS
        </h2>
        <p className="font-body text-hotel-white/90 max-w-3xl mx-auto mb-14 leading-relaxed">
          Each room at our hotel is decorated with great taste. Designer's solutions will impress you greatly.
          Each and every trifle is here for your comfort. Room service personnel is perfectly trained.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {amenities.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <item.icon className="w-12 h-12 text-hotel-white" strokeWidth={1.2} />
              <span className="font-body text-xs tracking-[0.2em] text-hotel-white font-bold">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}