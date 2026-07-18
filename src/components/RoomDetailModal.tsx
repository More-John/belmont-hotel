"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export type Room = {
    id: string;
    label: string;
    desc: string;
    images: string[];
    price: number;
    amenities?: string[];
    bedType?: string;
    size?: string;
};

interface RoomDetailModalProps {
    room: Room | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBookNow: (room: Room) => void;
}

export function RoomDetailModal({ room, open, onOpenChange, onBookNow }: RoomDetailModalProps) {
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    // Reset state when modal opens/closes
    useEffect(() => {
        if (open) {
            setCurrentImgIdx(0);
            setCheckIn("");
            setCheckOut("");
        }
    }, [open]);

    if (!room) return null;

    // Calculate total nights
    let totalNights = 0;
    if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
            totalNights = diffDays;
        }
    }

    const totalCost = totalNights > 0 ? totalNights * room.price : 0;

    const handleBookClick = () => {
        // Pass the prefilled data via custom event
        if (checkIn || checkOut) {
            window.dispatchEvent(new CustomEvent("prefill-reservation", {
                detail: {
                    roomType: room.id,
                    checkIn,
                    checkOut
                }
            }));
        } else {
            // Still prefill the room type
            window.dispatchEvent(new CustomEvent("prefill-reservation", {
                detail: { roomType: room.id }
            }));
        }
        
        onBookNow(room);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-hotel-black border border-hotel-gold/50 shadow-xl p-4 sm:p-6 [&>button>svg]:text-hotel-white">
                <DialogHeader>
                    <DialogTitle className="font-display text-2xl text-hotel-white tracking-wider">
                        {room.label}
                    </DialogTitle>
                    <DialogDescription className="font-body text-sm text-hotel-white/70">
                        {room.bedType && `${room.bedType} • `}
                        {room.size && `${room.size} • `}
                        <span className="capitalize">room</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Main Image */}
                    {room.images && room.images.length > 0 ? (
                        <div className="space-y-2">
                            <div className="relative h-48 sm:h-64 w-full rounded-md overflow-hidden border border-hotel-gold/30">
                                <Image
                                    src={room.images[currentImgIdx]}
                                    alt={room.label}
                                    fill
                                    className="object-cover transition-opacity duration-300"
                                />
                            </div>
                            {/* Thumbnails */}
                            {room.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {room.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImgIdx(idx)}
                                            className={`relative h-16 w-24 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${currentImgIdx === idx ? 'border-hotel-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative h-48 sm:h-64 w-full rounded-md overflow-hidden border border-hotel-gold/30 bg-hotel-black/50 flex items-center justify-center">
                            <span className="text-hotel-white/50 font-body text-sm">Image coming soon</span>
                        </div>
                    )}

                    {/* Price and Description */}
                    <div>
                        <div className="font-display text-2xl text-hotel-gold mb-4">
                            ₦{room.price.toLocaleString()} <span className="text-sm text-hotel-white/60 font-body">/ night</span>
                        </div>
                        <p className="font-body text-hotel-white/80 whitespace-pre-line leading-relaxed text-base">
                            {room.desc}
                        </p>
                    </div>

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                        <div>
                            <h4 className="font-display text-sm uppercase tracking-wider text-hotel-gold mb-3">
                                Amenities
                            </h4>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {room.amenities.map((item, idx) => (
                                    <li key={idx} className="font-body text-sm text-hotel-white/70 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-hotel-gold rounded-full flex-shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Date Picker & Calculation */}
                    <div className="border-t border-hotel-gold/20 pt-6 mt-6">
                        <h4 className="font-display text-sm uppercase tracking-wider text-hotel-gold mb-4">
                            Check Availability
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative w-full">
                                <label className="block text-hotel-white/60 text-xs font-body mb-1">Check-in</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full bg-transparent border border-hotel-white/30 px-3 py-2 font-body text-hotel-white focus:outline-none focus:border-hotel-gold [color-scheme:dark]"
                                />
                            </div>
                            <div className="relative w-full">
                                <label className="block text-hotel-white/60 text-xs font-body mb-1">Check-out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    min={checkIn}
                                    className="w-full bg-transparent border border-hotel-white/30 px-3 py-2 font-body text-hotel-white focus:outline-none focus:border-hotel-gold [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {totalNights > 0 && (
                            <div className="mt-4 p-4 bg-hotel-gold/10 border border-hotel-gold/20 rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-body text-hotel-white/80 text-sm">Total Nights:</span>
                                    <span className="font-body text-hotel-white text-sm font-bold">{totalNights}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-body text-hotel-white/80 text-sm">Total Cost:</span>
                                    <span className="font-display text-hotel-gold text-lg">₦{totalCost.toLocaleString()}</span>
                                </div>
                                <div className="text-center font-body text-xs text-hotel-white/90 bg-hotel-gold/20 py-2 rounded">
                                    Room type and nights are available confirmed.
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full bg-transparent border-hotel-gold/30 text-hotel-white hover:bg-hotel-white/10 hover:text-hotel-white font-body tracking-wide transition-colors"
                    >
                        GO BACK
                    </Button>
                    <Button
                        onClick={handleBookClick}
                        className="w-full bg-hotel-gold text-hotel-black font-body tracking-wide hover:bg-hotel-gold-light transition-colors"
                    >
                        BOOK THIS ROOM
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}