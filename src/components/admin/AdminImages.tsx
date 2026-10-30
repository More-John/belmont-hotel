"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type ImageItem = {
    id: string;
    url: string;
    alt: string | null;
    section: string;
    order: number;
    createdAt: string;
};

const sections = ["All", "Hero", "Rooms", "Services"];

export function AdminImages() {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [filter, setFilter] = useState("All");
    const [showUpload, setShowUpload] = useState(false);
    const [preview, setPreview] = useState<ImageItem | null>(null);
    const [loading, setLoading] = useState(true);

    // Upload form state
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadLabel, setUploadLabel] = useState("");
    const [uploadSection, setUploadSection] = useState("Hero");
    const [uploadRoomType, setUploadRoomType] = useState("business-suite");
    const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    // Auto-update label based on section
    useEffect(() => {
        if (!showUpload) return;

        if (uploadSection === "Hero") {
            const heroImages = images.filter((i) => i.section === "Hero");
            const nextNum = Math.min(heroImages.length + 1, 10);
            const formattedNum = nextNum.toString().padStart(2, "0");
            setUploadLabel(`hero-section-${formattedNum}`);
        } else if (uploadSection === "Rooms") {
            const prefix = `room-${uploadRoomType}`;
            const roomImages = images.filter((i) => i.alt?.startsWith(prefix));
            const nextNum = Math.min(roomImages.length + 1, 5);
            const formattedNum = nextNum.toString().padStart(2, "0");
            setUploadLabel(`${prefix}-${formattedNum}`);
        } else if (uploadSection === "Services") {
            if (!uploadLabel.startsWith("service-")) setUploadLabel("service-conference");
        }
    }, [uploadSection, images, showUpload, uploadLabel, uploadRoomType]);

    const fetchImages = async () => {
        try {
            const res = await fetch("/api/images");
            if (res.ok) {
                const data = await res.json();
                setImages(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch images", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = filter === "All" ? images : images.filter((i) => i.section === filter);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            const res = await fetch(`/api/images?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setImages(images.filter((i) => i.id !== id));
            } else {
                alert("Failed to delete image.");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete image.");
        }
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

    const handleUpload = async () => {
        if (!uploadFile || !uploadLabel.trim()) {
            alert("Please select an image and provide a label.");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("alt", uploadLabel.trim());
        formData.append("section", uploadSection);

        try {
            const res = await fetch("/api/images", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const newImage = await res.json();
                setImages((prev) => [newImage, ...prev]);
                closeUploadModal();
            } else {
                const errData = await res.json();
                alert(`Upload failed: ${errData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const closeUploadModal = () => {
        setShowUpload(false);
        if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
        setUploadPreviewUrl(null);
        setUploadFile(null);
        setUploadLabel("");
        setUploadSection("Hero");
        setUploadRoomType("business-suite");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
                <h1 className="font-display text-xl sm:text-2xl text-foreground tracking-wider">Image Gallery</h1>
                <button
                    onClick={() => setShowUpload(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-hotel-gold text-hotel-black font-body font-bold tracking-[0.15em] text-xs px-5 py-3 min-h-[44px] hover:bg-hotel-gold-light transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    UPLOAD IMAGE
                </button>
            </div>

            {/* Section Filters */}
            <div className="flex gap-2 mb-5 sm:mb-6 flex-wrap">
                {sections.map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`font-body text-xs tracking-wider px-3.5 py-2 min-h-[40px] border transition-colors ${
                            filter === s
                                ? "border-hotel-gold bg-hotel-gold/10 text-hotel-gold font-semibold"
                                : "border-border text-muted-foreground hover:border-foreground"
                        }`}
                    >
                        {s.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Image Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-hotel-gold" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground font-body">
                    No images found in this section.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((img) => (
                        <div key={img.id} className="bg-card border border-border group relative overflow-hidden">
                            <div
                                className="aspect-video cursor-pointer relative bg-muted"
                                onClick={() => setPreview(img)}
                            >
                                <Image
                                    src={img.url}
                                    alt={img.alt || "Hotel Image"}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                    <p className="font-body text-sm font-bold text-foreground truncate">{img.alt}</p>
                                    <p className="font-body text-xs text-muted-foreground truncate">{img.section}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="text-muted-foreground hover:text-destructive transition-colors p-2.5 -mr-1 shrink-0"
                                    aria-label={`Delete ${img.alt}`}
                                    title={`Delete ${img.alt}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            <Dialog open={showUpload} onOpenChange={setShowUpload}>
                <DialogContent className="w-[95vw] sm:max-w-md max-h-[90dvh] overflow-y-auto p-4 sm:p-6 bg-black text-white border-zinc-700 rounded-none">
                    <DialogHeader>
                        <DialogTitle className="font-display tracking-wider text-base sm:text-lg">Upload New Image</DialogTitle>
                        <DialogDescription className="sr-only">
                            Form to upload a new image for a specific section.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div>
                            <label htmlFor="image-file" className="block font-body text-sm text-white/70 mb-1.5">Image File</label>
                            <input
                                id="image-file"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full font-body text-base sm:text-sm text-white file:mr-3 file:py-2.5 file:px-4 file:border file:border-border file:bg-white/10 file:text-white file:font-body file:text-xs file:cursor-pointer"
                                title="Upload image file"
                            />
                            {uploadPreviewUrl && (
                                <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-none border border-border">
                                    <Image src={uploadPreviewUrl} alt="Preview" fill unoptimized className="object-cover" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="image-section" className="block font-body text-sm text-white/70 mb-1.5">Section</label>
                            <select
                                id="image-section"
                                value={uploadSection}
                                onChange={(e) => setUploadSection(e.target.value)}
                                className="w-full bg-black border border-border text-white px-3.5 py-2.5 min-h-[44px] font-body text-base sm:text-sm focus:outline-none focus:border-hotel-gold"
                                title="Section"
                            >
                                <option>Hero</option>
                                <option>Rooms</option>
                                <option>Services</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="image-label" className="block font-body text-sm text-white/70 mb-1.5">Label / Alt Text</label>
                            {uploadSection === "Hero" ? (
                                <input
                                    id="image-label"
                                    type="text"
                                    readOnly
                                    value={uploadLabel}
                                    className="w-full bg-white/10 border border-border text-white/50 px-3.5 py-2.5 min-h-[44px] font-body text-base sm:text-sm focus:outline-none focus:border-hotel-gold cursor-not-allowed"
                                    title="Auto-generated Hero Label"
                                />
                            ) : uploadSection === "Rooms" ? (
                                <div className="space-y-2">
                                    <select
                                        value={uploadRoomType}
                                        onChange={(e) => setUploadRoomType(e.target.value)}
                                        className="w-full bg-black border border-border text-white px-3.5 py-2.5 min-h-[44px] font-body text-base sm:text-sm focus:outline-none focus:border-hotel-gold"
                                    >
                                        <option value="business-suite">Business Suite</option>
                                        <option value="executive-suite">Executive Suite</option>
                                        <option value="executive-deluxe">Executive Deluxe</option>
                                        <option value="deluxe">Deluxe Room</option>
                                    </select>
                                    <input
                                        id="image-label"
                                        type="text"
                                        readOnly
                                        value={uploadLabel}
                                        className="w-full bg-white/10 border border-border text-white/50 px-3.5 py-2.5 min-h-[44px] font-body text-base sm:text-sm focus:outline-none focus:border-hotel-gold cursor-not-allowed"
                                        title="Auto-generated Room Label"
                                    />
                                </div>
                            ) : uploadSection === "Services" ? (
                                <select
                                    id="image-label"
                                    value={uploadLabel}
                                    onChange={(e) => setUploadLabel(e.target.value)}
                                    className="w-full bg-black border border-border text-white px-3.5 py-2.5 min-h-[44px] font-body text-base sm:text-sm focus:outline-none focus:border-hotel-gold"
                                >
                                    <option value="service-conference">service-conference</option>
                                    <option value="service-event">service-event</option>
                                    <option value="service-minibar">service-minibar</option>
                                    <option value="service-restaurant">service-restaurant</option>
                                    <option value="service-catering">service-catering</option>
                                </select>
                            ) : (
                                <input
                                    id="image-label"
                                    type="text"
                                    placeholder="e.g. Hotel Pool View"
                                    value={uploadLabel}
                                    onChange={(e) => setUploadLabel(e.target.value)}
                                    className="w-full bg-white/10 border border-border text-white placeholder:text-white/50 px-3.5 py-2.5 min-h-[44px] font-body text-base sm:text-sm focus:outline-none focus:border-hotel-gold"
                                    title="Image Label"
                                />
                            )}
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeUploadModal}
                            disabled={isUploading}
                            className="w-full sm:w-auto min-h-[44px] rounded-none border-border text-white bg-transparent hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="w-full sm:w-auto min-h-[44px] rounded-none bg-hotel-gold text-hotel-black hover:bg-hotel-gold-light font-bold tracking-widest text-xs"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    UPLOADING...
                                </>
                            ) : (
                                "UPLOAD"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Modal */}
            {preview && (
                <div
                    className="fixed inset-0 z-50 bg-hotel-black/95 flex items-center justify-center p-3 sm:p-4"
                    onClick={() => setPreview(null)}
                >
                    <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-3 gap-2">
                            <p className="font-body text-hotel-white text-xs sm:text-sm truncate">{preview.alt} — {preview.section}</p>
                            <button
                                onClick={() => setPreview(null)}
                                className="text-hotel-white/70 hover:text-hotel-white p-2 -mr-1 shrink-0"
                                aria-label="Close preview"
                                title="Close preview"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="relative w-full h-[70dvh] sm:h-[75vh]">
                            <Image
                                src={preview.url}
                                alt={preview.alt || "Preview"}
                                fill
                                unoptimized
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
