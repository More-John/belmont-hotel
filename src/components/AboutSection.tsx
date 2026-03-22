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
    <section id="about" className="bg-hotel-white py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-5xl text-hotel-black tracking-wider mb-6">
          LUXURY HOTEL THAT FEELS LIKE HOME
        </h2>
        <p className="font-body text-hotel-black/90 max-w-3xl mx-auto mb-14 leading-relaxed">
          Every room is thoughtfully designed with your comfort in mind. You'll notice the care in every detail, and our room service team is always ready to make your stay effortless.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {amenities.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <item.icon className="w-12 h-12 text-hotel-black" strokeWidth={1.2} />
              <span className="font-body text-xs tracking-[0.2em] text-hotel-black font-bold">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}