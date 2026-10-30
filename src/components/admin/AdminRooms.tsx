"use client";

import { useState, useEffect } from "react";
import { BedDouble, Edit2, Loader2, Check, Sparkles, Maximize2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { defaultRooms } from "@/data/defaultRooms";
import { fetchRoomsFromApi, saveRoomToApi } from "@/lib/roomsApi";
import type { Room } from "@/components/RoomDetailModal";

export function AdminRooms() {
    const [rooms, setRooms] = useState<Room[]>(defaultRooms);
    const [loading, setLoading] = useState(true);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [label, setLabel] = useState("");
    const [priceInput, setPriceInput] = useState("");
    const [desc, setDesc] = useState("");
    const [bedType, setBedType] = useState("");
    const [size, setSize] = useState("");
    const [amenitiesText, setAmenitiesText] = useState("");
    const [saving, setSaving] = useState(false);
    const [savedId, setSavedId] = useState<string | null>(null);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const data = await fetchRoomsFromApi();
            if (Array.isArray(data) && data.length > 0) {
                setRooms(data);
            }
        } catch (err) {
            console.error("Failed to fetch rooms:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const openEditModal = (room: Room) => {
        setEditingRoom(room);
        setLabel(room.label);
        setPriceInput(String(room.price));
        setDesc(room.desc);
        setBedType(room.bedType || "");
        setSize(room.size || "");
        setAmenitiesText((room.amenities || []).join(", "));
        setIsModalOpen(true);
    };

    const handlePriceChange = (val: string) => {
        // Allow only digits so the permanent ₦ symbol is paired with clean numbers
        const digitsOnly = val.replace(/[^0-9]/g, "");
        setPriceInput(digitsOnly);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRoom) return;

        const numericPrice = Number(priceInput);
        if (!numericPrice || numericPrice <= 0) {
            alert("Please enter a valid room price figure.");
            return;
        }

        if (!desc.trim()) {
            alert("Room description cannot be empty.");
            return;
        }

        setSaving(true);
        const amenitiesArray = amenitiesText
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean);

        const payload = {
            id: editingRoom.id,
            label: label.trim() || editingRoom.label,
            price: numericPrice,
            desc: desc.trim(),
            bedType: bedType.trim(),
            size: size.trim(),
            amenities: amenitiesArray,
        };

        try {
            const updated = await saveRoomToApi(payload);
            setRooms((prev) =>
                prev.map((r) => (r.id === editingRoom.id ? { ...r, ...updated } : r))
            );
            setSavedId(editingRoom.id);
            setTimeout(() => setSavedId(null), 3000);
            setIsModalOpen(false);
        } catch (err: any) {
            console.error("Failed to save room:", err);
            alert(err?.message || "Failed to save room details.");
        } finally {
            setSaving(false);
        }
    };

    const formattedPreviewPrice = priceInput ? Number(priceInput).toLocaleString() : "0";

    return (
        <div className="space-y-5 sm:space-y-6 w-full min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-hotel-dark p-4 sm:p-6 rounded-lg border border-border">
                <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-display text-hotel-white tracking-wide flex items-center gap-2">
                        <BedDouble className="w-5 h-5 text-hotel-gold shrink-0" />
                        <span className="truncate">Rooms, Pricing & Descriptions</span>
                    </h2>
                    <p className="text-xs text-hotel-white/60 mt-1">
                        Edit nightly room rates (₦), room descriptions, bed configurations, and amenities displayed on the website.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20 text-hotel-white/60 gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-hotel-gold" />
                    <span>Loading room details...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-hotel-dark rounded-lg border border-border/60 overflow-hidden flex flex-col justify-between hover:border-hotel-gold/50 transition-all"
                        >
                            <div className="p-4 sm:p-6 space-y-4">
                                {/* Top Row: Title + Price */}
                                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/30 pb-3">
                                    <div>
                                        <h3 className="font-display text-base sm:text-lg text-hotel-white tracking-wider">
                                            {room.label}
                                        </h3>
                                        <p className="font-body text-xs text-hotel-white/50 flex items-center gap-2 mt-0.5">
                                            <span>{room.bedType || "Double bed"}</span>
                                            {room.size && (
                                                <>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Maximize2 className="w-3 h-3 text-hotel-gold" />
                                                        {room.size}
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-display text-xl sm:text-2xl text-hotel-gold font-bold">
                                            ₦{Number(room.price).toLocaleString()}
                                        </span>
                                        <span className="block font-body text-[10px] text-hotel-white/50">
                                            per night
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <p className="font-body text-[11px] uppercase tracking-wider text-hotel-gold/80 mb-1">
                                        Description
                                    </p>
                                    <p className="font-body text-xs sm:text-sm text-hotel-white/80 whitespace-pre-line leading-relaxed line-clamp-4">
                                        {room.desc}
                                    </p>
                                </div>

                                {/* Amenities */}
                                {room.amenities && room.amenities.length > 0 && (
                                    <div>
                                        <p className="font-body text-[11px] uppercase tracking-wider text-hotel-gold/80 mb-1.5">
                                            Amenities ({room.amenities.length})
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {room.amenities.map((amenity, idx) => (
                                                <span
                                                    key={idx}
                                                    className="font-body text-[11px] bg-black/40 border border-border/40 text-hotel-white/75 px-2.5 py-0.5 rounded"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Action */}
                            <div className="px-4 sm:px-6 py-3.5 bg-black/30 border-t border-border/30 flex items-center justify-between gap-3">
                                {savedId === room.id ? (
                                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-body">
                                        <Check className="w-4 h-4" />
                                        Saved!
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-hotel-white/40 font-body">
                                        ID: {room.id}
                                    </span>
                                )}
                                <Button
                                    onClick={() => openEditModal(room)}
                                    className="w-full sm:w-auto min-h-[42px] bg-hotel-gold hover:bg-hotel-gold/90 text-hotel-black font-semibold text-xs tracking-wider flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Edit Room Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Room Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-[95vw] max-w-xl bg-hotel-dark border-border text-hotel-white max-h-[90dvh] overflow-y-auto p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="font-display text-base sm:text-lg text-hotel-gold">
                            Edit Room — {editingRoom?.label}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-hotel-white/60">
                            Update the room rate, description, bed type, size, or amenities. The &ldquo;₦&rdquo; currency symbol is permanent.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4 pt-2">
                        {/* Price with permanent ₦ prefix */}
                        <div>
                            <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                Nightly Rate (Figures Only) *
                            </label>
                            <div className="flex items-stretch rounded border border-border bg-black/40 focus-within:border-hotel-gold overflow-hidden">
                                <span className="flex items-center justify-center px-4 bg-hotel-gold/20 text-hotel-gold font-display font-bold text-base border-r border-border select-none">
                                    ₦
                                </span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    required
                                    value={priceInput}
                                    onChange={(e) => handlePriceChange(e.target.value)}
                                    placeholder="80625"
                                    className="flex-1 bg-transparent px-3.5 py-2.5 min-h-[44px] text-base sm:text-sm text-hotel-white font-body focus:outline-none"
                                />
                            </div>
                            <p className="text-[11px] text-hotel-gold/90 mt-1 font-body">
                                Live display preview: <strong>₦{formattedPreviewPrice}</strong> / night
                            </p>
                        </div>

                        {/* Room Description */}
                        <div>
                            <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                Room Description *
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Describe the room, bed type, bathroom, and key highlights..."
                                className="w-full bg-black/40 border border-border rounded px-3 py-2.5 text-base sm:text-xs text-hotel-white focus:outline-none focus:border-hotel-gold leading-relaxed"
                            />
                        </div>

                        {/* Room Title, Bed Type & Size */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                    Room Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    className="w-full bg-black/40 border border-border rounded px-3 py-2.5 min-h-[42px] text-base sm:text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                    Bed Type
                                </label>
                                <input
                                    type="text"
                                    value={bedType}
                                    onChange={(e) => setBedType(e.target.value)}
                                    placeholder="e.g. Large double bed"
                                    className="w-full bg-black/40 border border-border rounded px-3 py-2.5 min-h-[42px] text-base sm:text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                    Room Size
                                </label>
                                <input
                                    type="text"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    placeholder="e.g. 34m²"
                                    className="w-full bg-black/40 border border-border rounded px-3 py-2.5 min-h-[42px] text-base sm:text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                                />
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                Amenities (Comma-separated)
                            </label>
                            <input
                                type="text"
                                value={amenitiesText}
                                onChange={(e) => setAmenitiesText(e.target.value)}
                                placeholder="Free Wi-Fi, Flat-screen TV, Air conditioning, Private bathroom"
                                className="w-full bg-black/40 border border-border rounded px-3 py-2.5 min-h-[42px] text-base sm:text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-border/40">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsModalOpen(false)}
                                className="w-full sm:w-auto min-h-[44px] text-xs text-hotel-white/70 hover:text-hotel-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto min-h-[44px] bg-hotel-gold hover:bg-hotel-gold/90 text-hotel-black font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5"
                            >
                                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                Save Room Changes
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
