"use client";

import { useState } from "react";
import { Menu, X, Star } from "lucide-react";

const navItems = [
    { label: "HOME", href: "#home" },
    { label: "ABOUT", href: "#about" },
    { label: "ROOMS", href: "#rooms" },
    { label: "SERVICES", href: "#services" },
    { label: "RESERVATION", href: "#reservation" },
    { label: "CONTACTS", href: "#contacts" },
];

export function SideNav() {
    const [activeSection, setActiveSection] = useState("home");
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleClick = (href: string) => {
        setActiveSection(href.replace("#", ""));
        setMobileOpen(false);
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            {/* Desktop side nav */}
            <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 z-50 bg-hotel-black flex-col items-center py-8 justify-between">
                <div className="flex flex-col items-center gap-1">
                    <div className="flex gap-0.5 mb-1">
                        <Star className="w-3 h-3 fill-hotel-gold text-hotel-gold" />
                        <Star className="w-3 h-3 fill-hotel-gold text-hotel-gold" />
                        <Star className="w-3 h-3 fill-hotel-gold text-hotel-gold" />
                        <Star className="w-3 h-3 fill-hotel-gold text-hotel-gold" />
                        <Star className="w-3 h-3 fill-hotel-gold text-hotel-gold" />
                    </div>
                    <span className="font-display text-2xl font-bold text-hotel-white tracking-wider">B</span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    {navItems.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => handleClick(item.href)}
                            className={`w-3 h-3 rounded-full transition-colors ${activeSection === item.href.replace("#", "")
                                ? "bg-hotel-gold"
                                : "bg-hotel-white"
                                }`}
                            title={item.label}
                            aria-label={item.label}
                        />
                    ))}
                </div>

                <div />
            </nav>

            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 bg-hotel-black p-3"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6 text-hotel-white" />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-hotel-black/95 flex flex-col items-center justify-center gap-8">
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="absolute top-4 right-4"
                        aria-label="Close menu"
                    >
                        <X className="w-8 h-8 text-hotel-white" />
                    </button>

                    <div className="flex flex-col items-center gap-1 mb-8">
                        <div className="flex gap-0.5 mb-1">
                            <Star className="w-3 h-3 fill-hotel-gold text-hotel-gold" />
                            <Star className="w-3 h-3 fill-hotel-gold text-hotel-gold" />
                            <Star className="w-3 h-3 fill-hotel-gold text-hotel-gold" />
                        </div>
                        <span className="font-display text-3xl font-bold text-hotel-white">BELMONT</span>
                    </div>

                    {navItems.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => handleClick(item.href)}
                            className="font-body text-lg tracking-[0.3em] text-hotel-white hover:text-hotel-gold transition-colors"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}