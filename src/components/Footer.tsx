"use client";

import { MapPin, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import belmontLogo from "@/assets/belmont-logo.png";

export function Footer() {
    return (
        <footer className="bg-hotel-black py-14 px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
                {/* Logo & name */}
                <div className="flex flex-col items-center md:items-start gap-2">
                    <img src={belmontLogo.src} alt="Belmont Hotel" className="w-28 h-auto mb-2" />
                    <span className="font-display text-2xl font-bold text-hotel-white tracking-wider">
                        BELMONT HOTEL
                    </span>
                    <p className="font-body text-sm text-hotel-white/60">
                        Luxury accommodations in the heart of Abuja.
                    </p>
                </div>

                {/* Address & phone */}
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-hotel-gold mt-0.5 shrink-0" />
                        <span className="font-body text-sm text-hotel-white/80">
                            Plot 1032 R.I. Uzoma Street Wuye <br />Abuja, 900001 Wupa, Nigeria
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-hotel-gold shrink-0" />
                        <span className="font-body text-sm text-hotel-white/80">
                            +234 702 662 2223
                        </span>
                    </div>
                </div>

                {/* Socials */}
                <div className="flex flex-col items-center md:items-start gap-3">
                    <span className="font-body text-sm text-hotel-white/60 tracking-wider">FOLLOW US</span>
                    <div className="flex gap-4">
                        <a
                            href="https://facebook.com/your_page"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-hotel-white/80 hover:text-hotel-gold transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>

                        <a
                            href="https://www.instagram.com/belmontabuja/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-hotel-white/80 hover:text-hotel-gold transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>

                        <a
                            href="https://twitter.com/your_handle"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-hotel-white/80 hover:text-hotel-gold transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center">
                <p className="font-body text-xs text-hotel-white/40 tracking-wider">
                    © 2026 BELMONT HOTEL. ALL RIGHTS RESERVED.
                </p>
            </div>
        </footer>
    );
}