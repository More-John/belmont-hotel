"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export type Room = {
    id: string;
    label: string;
    desc: string;
    image: any;
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
    if (!room) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-hotel-black border border-hotel-gold/50 shadow-xl">
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

                {room.image ? (
                    <div className="relative h-64 w-full rounded-md overflow-hidden border border-hotel-gold/30">
                        <Image
                            src={room.image}
                            alt={room.label}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="relative h-64 w-full rounded-md overflow-hidden border border-hotel-gold/30 bg-hotel-black/50 flex items-center justify-center">
                        <span className="text-hotel-white/50 font-body text-sm">Image coming soon</span>
                    </div>
                )}

                <div className="mt-4 space-y-4">
                    <p className="font-body text-hotel-white/80 whitespace-pre-line leading-relaxed text-base">
                        {room.desc}
                    </p>

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
                </div>

                <Button
                    onClick={() => {
                        onBookNow(room);
                        onOpenChange(false);
                    }}
                    className="mt-6 w-full bg-hotel-gold text-hotel-black font-body tracking-wide hover:bg-hotel-gold/90 transition-colors"
                >
                    BOOK THIS ROOM
                </Button>
            </DialogContent>
        </Dialog>
    );
}