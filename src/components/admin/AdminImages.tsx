"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import heroLobby from "@/assets/hero-lobby.jpg";
import heroExterior from "@/assets/hero-exterior.jpg";
import heroRooftop from "@/assets/hero-lobby.jpg";
import heroSuite from "@/assets/hero-suite.jpg";
import roomLuxury from "@/assets/room-luxury.jpg";
import roomJunior from "@/assets/room-junior.jpg";
import roomEconomy from "@/assets/room-economy.jpg";
import serviceRestaurant from "@/assets/service-restaurant.jpg";
import serviceMinibar from "@/assets/service-minibar.jpg";
import serviceEvent from "@/assets/service-event.jpg";
import serviceConference from "@/assets/service-conference.jpg";
import type { StaticImageData } from "next/image";

// For user‑uploaded images we store the object URL as string
type ImageItem = {
    id: string;
    src: StaticImageData | string; // can be imported asset or blob URL
    label: string;
    section: string;
};

const initialImages: ImageItem[] = [
    { id: "1", src: heroLobby, label: "Hotel Lobby", section: "Hero" },
    { id: "2", src: heroExterior, label: "Hotel Exterior", section: "Hero" },
    { id: "3", src: heroRooftop, label: "Rooftop Lounge", section: "Hero" },
    { id: "4", src: heroSuite, label: "Luxury Suite", section: "Hero" },
    { id: "5", src: roomLuxury, label: "Executive Room", section: "Rooms" },
    { id: "6", src: roomJunior, label: "Deluxe Double Room", section: "Rooms" },
    { id: "7", src: roomEconomy, label: "One-Bedroom Room", section: "Rooms" },
    { id: "8", src: serviceRestaurant, label: "Restaurant", section: "Services" },
    { id: "9", src: serviceMinibar, label: "Mini Bar", section: "Services" },
    { id: "10", src: serviceEvent, label: "Event Center", section: "Services" },
    { id: "11", src: serviceConference, label: "Conference Hall", section: "Services" },
];

const sections = ["All", "Hero", "Rooms", "Services"];

export function AdminImages() {
    const [images, setImages] = useState<ImageItem[]>(initialImages);
    const [filter, setFilter] = useState("All");
    const [showUpload, setShowUpload] = useState(false);
    const [preview, setPreview] = useState<ImageItem | null>(null);

    // Upload form state
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadLabel, setUploadLabel] = useState("");
    const [uploadSection, setUploadSection] = useState("Hero");
    const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const filtered = filter === "All" ? images : images.filter((i) => i.section === filter);

    const handleDelete = (id: string) => {
        const deletedImage = images.find((img) => img.id === id);
        if (deletedImage && typeof deletedImage.src === "string" && deletedImage.src.startsWith("blob:")) {
            URL.revokeObjectURL(deletedImage.src);
        }
        setImages(images.filter((i) => i.id !== id));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadFile(file);
        // Create preview URL
        if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
        const previewUrl = URL.createObjectURL(file);
        setUploadPreviewUrl(previewUrl);
    };

    const handleUpload = () => {
        if (!uploadFile || !uploadLabel.trim()) {
            alert("Please select an image and provide a label.");
            return;
        }
        const newId = Date.now().toString();
        const newImage: ImageItem = {
            id: newId,
            src: uploadPreviewUrl!, // store blob URL
            label: uploadLabel.trim(),
            section: uploadSection,
        };
        setImages((prev) => [...prev, newImage]);
        // Reset form
        setUploadFile(null);
        setUploadLabel("");
        setUploadSection("Hero");
        if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
        setUploadPreviewUrl(null);
        setShowUpload(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const closeUploadModal = () => {
        setShowUpload(false);
        if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
        setUploadPreviewUrl(null);
        setUploadFile(null);
        setUploadLabel("");
        setUploadSection("Hero");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="font-display text-2xl text-foreground tracking-wider">Image Gallery</h1>
                <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 bg-hotel-gold text-hotel-black font-body font-bold tracking-[0.15em] text-xs px-5 py-2.5 hover:bg-hotel-gold-light transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    UPLOAD IMAGE
                </button>
            </div>

            {/* Section Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {sections.map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`font-body text-xs tracking-wider px-4 py-2 border transition-colors ${filter === s
                            ? "border-hotel-gold bg-hotel-gold/10 text-hotel-gold"
                            : "border-border text-muted-foreground hover:border-foreground"
                            }`}
                    >
                        {s.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((img) => (
                    <div key={img.id} className="bg-card border border-border group relative overflow-hidden">
                        <div
                            className="aspect-video cursor-pointer relative"
                            onClick={() => setPreview(img)}
                        >
                            <Image
                                src={img.src}
                                alt={img.label}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="p-3 flex items-center justify-between">
                            <div>
                                <p className="font-body text-sm font-bold text-foreground">{img.label}</p>
                                <p className="font-body text-xs text-muted-foreground">{img.section}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(img.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                aria-label={`Delete ${img.label}`}
                                title={`Delete ${img.label}`}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 z-50 bg-hotel-black/70 flex items-center justify-center p-4">
                    <div className="bg-card border border-border w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display text-lg text-foreground tracking-wider">Upload Image</h2>
                            <button onClick={closeUploadModal} className="text-muted-foreground hover:text-foreground" aria-label="Close modal" title="Close modal">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="image-file" className="block font-body text-sm text-muted-foreground mb-1.5">Image File</label>
                                <input
                                    id="image-file"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full font-body text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:border file:border-border file:bg-muted file:text-foreground file:font-body file:text-xs file:cursor-pointer"
                                    title="Upload image file"
                                />
                                {uploadPreviewUrl && (
                                    <div className="mt-2 relative aspect-video w-full overflow-hidden rounded">
                                        <Image src={uploadPreviewUrl} alt="Preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="image-label" className="block font-body text-sm text-muted-foreground mb-1.5">Label</label>
                                <input
                                    id="image-label"
                                    type="text"
                                    placeholder="e.g. Hotel Pool View"
                                    value={uploadLabel}
                                    onChange={(e) => setUploadLabel(e.target.value)}
                                    className="w-full bg-muted border border-border text-foreground placeholder:text-muted-foreground px-4 py-2.5 font-body text-sm focus:outline-none focus:border-hotel-gold"
                                    title="Image Label"
                                />
                            </div>
                            <div>
                                <label htmlFor="image-section" className="block font-body text-sm text-muted-foreground mb-1.5">Section</label>
                                <select
                                    id="image-section"
                                    value={uploadSection}
                                    onChange={(e) => setUploadSection(e.target.value)}
                                    className="w-full bg-muted border border-border text-foreground px-4 py-2.5 font-body text-sm focus:outline-none focus:border-hotel-gold"
                                    title="Section"
                                >
                                    <option>Hero</option>
                                    <option>Rooms</option>
                                    <option>Services</option>
                                </select>
                            </div>
                            <button
                                onClick={handleUpload}
                                className="w-full bg-hotel-gold text-hotel-black font-body font-bold tracking-[0.15em] text-xs py-3 hover:bg-hotel-gold-light transition-colors mt-2"
                            >
                                UPLOAD
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {preview && (
                <div
                    className="fixed inset-0 z-50 bg-hotel-black/90 flex items-center justify-center p-4"
                    onClick={() => setPreview(null)}
                >
                    <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-3">
                            <p className="font-body text-hotel-white text-sm">{preview.label} — {preview.section}</p>
                            <button onClick={() => setPreview(null)} className="text-hotel-white/60 hover:text-hotel-white" aria-label="Close preview" title="Close preview">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="relative w-full h-[75vh]">
                            <Image
                                src={preview.src}
                                alt={preview.label}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}