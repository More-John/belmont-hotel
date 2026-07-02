"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
    const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch("/api/images");
            if (res.ok) {
                const data = await res.json();
                setImages(data);
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
            const res = await fetch(`/api/images?id=${id}`, { method: 'DELETE' });
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
                setImages((prev) => [...prev, newImage]);
                closeUploadModal();
            } else {
                const errData = await res.json();
                alert(`Upload failed: ${errData.error || 'Unknown error'}`);
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
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <div className="p-3 flex items-center justify-between">
                                <div>
                                    <p className="font-body text-sm font-bold text-foreground">{img.alt}</p>
                                    <p className="font-body text-xs text-muted-foreground">{img.section}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
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
                <DialogContent className="sm:max-w-md bg-black text-white border-zinc-700 rounded-none">
                    <DialogHeader>
                        <DialogTitle className="font-display tracking-wider">Upload New Image</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label htmlFor="image-file" className="block font-body text-sm text-white/70 mb-1.5">Image File</label>
                            <input
                                id="image-file"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full font-body text-sm text-white file:mr-4 file:py-2 file:px-4 file:border file:border-border file:bg-white/10 file:text-white file:font-body file:text-xs file:cursor-pointer"
                                title="Upload image file"
                            />
                            {uploadPreviewUrl && (
                                <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-none border border-border">
                                    <Image src={uploadPreviewUrl} alt="Preview" fill className="object-cover" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="image-label" className="block font-body text-sm text-white/70 mb-1.5">Label / Alt Text</label>
                            <input
                                id="image-label"
                                type="text"
                                placeholder="e.g. Hotel Pool View"
                                value={uploadLabel}
                                onChange={(e) => setUploadLabel(e.target.value)}
                                className="w-full bg-white/10 border border-border text-white placeholder:text-white/50 px-4 py-2.5 font-body text-sm focus:outline-none focus:border-hotel-gold"
                                title="Image Label"
                            />
                        </div>
                        <div>
                            <label htmlFor="image-section" className="block font-body text-sm text-white/70 mb-1.5">Section</label>
                            <select
                                id="image-section"
                                value={uploadSection}
                                onChange={(e) => setUploadSection(e.target.value)}
                                className="w-full bg-black border border-border text-white px-4 py-2.5 font-body text-sm focus:outline-none focus:border-hotel-gold"
                                title="Section"
                            >
                                <option>Hero</option>
                                <option>Rooms</option>
                                <option>Services</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end gap-2">
                        <Button type="button" variant="outline" onClick={closeUploadModal} disabled={isUploading} className="rounded-none border-border text-white bg-transparent hover:bg-white/10 hover:text-white">
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="rounded-none bg-hotel-gold text-hotel-black hover:bg-hotel-gold-light font-bold tracking-widest text-xs"
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
                    className="fixed inset-0 z-50 bg-hotel-black/90 flex items-center justify-center p-4"
                    onClick={() => setPreview(null)}
                >
                    <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-3">
                            <p className="font-body text-hotel-white text-sm">{preview.alt} — {preview.section}</p>
                            <button onClick={() => setPreview(null)} className="text-hotel-white/60 hover:text-hotel-white" aria-label="Close preview" title="Close preview">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="relative w-full h-[75vh]">
                            <Image
                                src={preview.url}
                                alt={preview.alt || "Preview"}
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