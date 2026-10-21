"use client";

import { useState, useEffect, useRef } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    Calendar,
    Tag,
    UploadCloud,
    Loader2,
    CheckCircle2,
    FileText,
    Sparkles,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { defaultPosts } from "@/data/defaultPosts";

export interface Post {
    id: string;
    title: string;
    slug: string;
    category: "Service Update" | "Event" | "Blog" | "News" | string;
    excerpt: string;
    content: string;
    imageUrl: string | null;
    author: string;
    status: "published" | "draft";
    eventDate: string | null;
    createdAt: string;
    updatedAt: string;
}

const CATEGORIES = ["All", "Event", "Service Update", "Blog", "News"];

export function AdminPosts() {
    const [posts, setPosts] = useState<Post[]>(defaultPosts as Post[]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Modal state for Create / Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    // Modal state for Preview
    const [previewPost, setPreviewPost] = useState<Post | null>(null);

    // Form fields
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Service Update");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [author, setAuthor] = useState("Belmont Hotel");
    const [status, setStatus] = useState<"published" | "draft">("published");
    const [eventDate, setEventDate] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/posts");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setPosts(data);
                }
            }
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const openCreateModal = () => {
        setEditingPost(null);
        setTitle("");
        setCategory("Service Update");
        setExcerpt("");
        setContent("");
        setImageUrl("");
        setAuthor("Belmont Hotel");
        setStatus("published");
        setEventDate("");
        setIsModalOpen(true);
    };

    const openEditModal = (post: Post) => {
        setEditingPost(post);
        setTitle(post.title);
        setCategory(post.category);
        setExcerpt(post.excerpt || "");
        setContent(post.content || "");
        setImageUrl(post.imageUrl || "");
        setAuthor(post.author || "Belmont Hotel");
        setStatus(post.status);
        setEventDate(post.eventDate ? post.eventDate.slice(0, 16) : "");
        setIsModalOpen(true);
    };

    // Upload an image directly to cPanel /api/images
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("alt", `post-${title ? title.slice(0, 20).toLowerCase().replace(/\s+/g, "-") : "image"}`);
        formData.append("section", "Updates");

        try {
            const res = await fetch("/api/images", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                setImageUrl(data.url);
            } else {
                alert("Failed to upload image.");
            }
        } catch (err) {
            console.error("Image upload failed", err);
            alert("Error uploading image to server.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("Title and Content are required.");
            return;
        }

        setSubmitting(true);
        const payload = {
            title: title.trim(),
            category,
            excerpt: excerpt.trim() || (content.trim().slice(0, 150) + "..."),
            content: content.trim(),
            imageUrl: imageUrl.trim() || null,
            author: author.trim() || "Belmont Hotel",
            status,
            eventDate: eventDate || null,
        };

        try {
            if (editingPost) {
                // Update
                const res = await fetch(`/api/posts?id=${editingPost.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setIsModalOpen(false);
                    await fetchPosts();
                } else {
                    const err = await res.json();
                    alert(err.error || "Failed to update post");
                }
            } else {
                // Create
                const res = await fetch("/api/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setIsModalOpen(false);
                    await fetchPosts();
                } else {
                    const err = await res.json();
                    alert(err.error || "Failed to create post");
                }
            }
        } catch (err) {
            console.error("Save error", err);
            alert("An error occurred while saving.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setPosts(posts.filter((p) => p.id !== id));
            } else {
                alert("Failed to delete post.");
            }
        } catch (err) {
            console.error("Delete error", err);
            alert("Error deleting post.");
        }
    };

    const toggleStatus = async (post: Post) => {
        const nextStatus = post.status === "published" ? "draft" : "published";
        try {
            const res = await fetch(`/api/posts?id=${post.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });
            if (res.ok) {
                setPosts(posts.map((p) => (p.id === post.id ? { ...p, status: nextStatus } : p)));
            }
        } catch (err) {
            console.error("Toggle error", err);
        }
    };

    const filteredPosts = posts.filter((post) => {
        const matchesCategory =
            selectedCategory === "All" || post.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header with Search and Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-hotel-dark p-6 rounded-lg border border-border">
                <div>
                    <h2 className="text-xl font-display text-hotel-white tracking-wide flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-hotel-gold" />
                        Updates, Events & Blogs
                    </h2>
                    <p className="text-xs text-hotel-white/60 mt-1">
                        Publish service announcements, upcoming events, and stories to keep your guests engaged.
                    </p>
                </div>
                <Button
                    onClick={openCreateModal}
                    className="bg-hotel-gold hover:bg-hotel-gold/90 text-hotel-black font-semibold text-xs tracking-wider flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Post / Update
                </Button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                selectedCategory === cat
                                    ? "bg-hotel-gold text-hotel-black shadow-sm font-semibold"
                                    : "bg-hotel-dark text-hotel-white/70 hover:text-hotel-white border border-border/40"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search input */}
                <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-hotel-white/40" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search posts or events..."
                        className="w-full bg-hotel-dark border border-border/50 rounded-lg pl-9 pr-4 py-1.5 text-xs text-hotel-white placeholder:text-hotel-white/40 focus:outline-none focus:border-hotel-gold"
                    />
                </div>
            </div>

            {/* Posts Cards Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20 text-hotel-white/60 gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-hotel-gold" />
                    <span>Loading updates & blog posts...</span>
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-20 bg-hotel-dark/40 rounded-lg border border-border/40 p-8">
                    <FileText className="w-12 h-12 text-hotel-gold/40 mx-auto mb-3" />
                    <h3 className="text-base text-hotel-white font-medium">No posts or updates found</h3>
                    <p className="text-xs text-hotel-white/50 mt-1 max-w-md mx-auto">
                        {searchTerm || selectedCategory !== "All"
                            ? "Try adjusting your search query or category filters."
                            : "Click 'New Post / Update' above to create your first event, news, or blog article."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-hotel-dark rounded-lg border border-border/50 overflow-hidden flex flex-col justify-between group hover:border-hotel-gold/50 transition-all duration-300"
                        >
                            <div>
                                {/* Post Cover Image */}
                                <div className="relative h-44 w-full bg-black/40 overflow-hidden">
                                    {post.imageUrl ? (
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-hotel-white/30 gap-1 bg-hotel-dark/60">
                                            <FileText className="w-8 h-8" />
                                            <span className="text-[10px]">No image attached</span>
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <span
                                        className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-md ${
                                            post.category === "Event"
                                                ? "bg-amber-500/90 text-hotel-black"
                                                : post.category === "Service Update"
                                                ? "bg-blue-500/90 text-hotel-white"
                                                : post.category === "Blog"
                                                ? "bg-purple-500/90 text-hotel-white"
                                                : "bg-emerald-500/90 text-hotel-white"
                                        }`}
                                    >
                                        {post.category}
                                    </span>

                                    {/* Status Badge */}
                                    <button
                                        onClick={() => toggleStatus(post)}
                                        className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md transition-all ${
                                            post.status === "published"
                                                ? "bg-emerald-600/90 text-hotel-white hover:bg-emerald-700"
                                                : "bg-gray-600/90 text-hotel-white/80 hover:bg-gray-700"
                                        }`}
                                        title="Click to toggle publish status"
                                    >
                                        {post.status}
                                    </button>
                                </div>

                                {/* Post Body */}
                                <div className="p-5 space-y-2">
                                    <div className="flex items-center gap-3 text-[11px] text-hotel-white/40">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(post.createdAt).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                        {post.eventDate && (
                                            <span className="text-amber-400/90 font-medium flex items-center gap-1">
                                                Event:{" "}
                                                {new Date(post.eventDate).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-display text-base text-hotel-white line-clamp-2 leading-snug">
                                        {post.title}
                                    </h3>

                                    <p className="text-xs text-hotel-white/60 line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 border-t border-border/30 flex items-center justify-between bg-black/20">
                                <span className="text-[10px] text-hotel-white/40 italic">By {post.author}</span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setPreviewPost(post)}
                                        className="h-7 w-7 text-hotel-white/70 hover:text-hotel-white hover:bg-white/10"
                                        title="Preview Post"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEditModal(post)}
                                        className="h-7 w-7 text-hotel-gold hover:text-hotel-gold hover:bg-hotel-gold/10"
                                        title="Edit Post"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(post.id)}
                                        className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                                        title="Delete Post"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Create / Edit */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl bg-hotel-dark border-border text-hotel-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-display text-lg text-hotel-gold">
                            {editingPost ? "Edit Post / Update" : "Create New Post / Event"}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-hotel-white/60">
                            Add news, service upgrades, or upcoming hotel events to display on the website.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4 pt-2">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Grand Poolside BBQ & Live Acoustic Night"
                                className="w-full bg-black/40 border border-border rounded px-3 py-2 text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                            />
                        </div>

                        {/* Category & Status Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-black/40 border border-border rounded px-3 py-2 text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                                >
                                    <option value="Service Update">Service Update</option>
                                    <option value="Event">Event</option>
                                    <option value="Blog">Blog Story</option>
                                    <option value="News">Hotel News</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full bg-black/40 border border-border rounded px-3 py-2 text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft (Hidden)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                    Event Date (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    className="w-full bg-black/40 border border-border rounded px-3 py-2 text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                                />
                            </div>
                        </div>

                        {/* Image Upload / URL */}
                        <div>
                            <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                Featured Image
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="/uploads/my-event.jpg or https://..."
                                    className="flex-1 bg-black/40 border border-border rounded px-3 py-2 text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={uploadingImage}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-hotel-gold/50 text-hotel-gold hover:bg-hotel-gold/10 text-xs flex items-center gap-1.5"
                                >
                                    {uploadingImage ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <UploadCloud className="w-3.5 h-3.5" />
                                    )}
                                    Upload File
                                </Button>
                            </div>
                            {imageUrl && (
                                <div className="mt-2 h-28 w-44 rounded border border-border overflow-hidden relative">
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                Short Excerpt / Summary
                            </label>
                            <input
                                type="text"
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Brief 1-2 sentence preview for cards and feeds"
                                className="w-full bg-black/40 border border-border rounded px-3 py-2 text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                            />
                        </div>

                        {/* Full Content */}
                        <div>
                            <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                Full Article / Event Content *
                            </label>
                            <textarea
                                required
                                rows={8}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write the full announcement, event schedule, package perks, or blog text here..."
                                className="w-full bg-black/40 border border-border rounded px-3 py-2 text-xs text-hotel-white focus:outline-none focus:border-hotel-gold leading-relaxed"
                            />
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-xs font-medium text-hotel-white/80 mb-1">
                                Author Name
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="e.g. Belmont Hotel Concierge"
                                className="w-full bg-black/40 border border-border rounded px-3 py-2 text-xs text-hotel-white focus:outline-none focus:border-hotel-gold"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsModalOpen(false)}
                                className="text-xs text-hotel-white/70 hover:text-hotel-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-hotel-gold hover:bg-hotel-gold/90 text-hotel-black font-semibold text-xs tracking-wider flex items-center gap-1.5"
                            >
                                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {editingPost ? "Update Post" : "Publish Post"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal for Preview */}
            <Dialog open={!!previewPost} onOpenChange={() => setPreviewPost(null)}>
                <DialogContent className="max-w-2xl bg-hotel-dark border-border text-hotel-white max-h-[85vh] overflow-y-auto">
                    {previewPost && (
                        <div className="space-y-4">
                            {previewPost.imageUrl && (
                                <div className="h-60 w-full rounded-lg overflow-hidden border border-border">
                                    <img
                                        src={previewPost.imageUrl}
                                        alt={previewPost.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-hotel-gold text-hotel-black uppercase">
                                    {previewPost.category}
                                </span>
                                <span className="text-xs text-hotel-white/50">
                                    {new Date(previewPost.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h2 className="font-display text-2xl text-hotel-white">{previewPost.title}</h2>
                            <div className="text-xs text-hotel-white/80 whitespace-pre-wrap leading-relaxed border-t border-border/40 pt-4">
                                {previewPost.content}
                            </div>
                            <p className="text-[11px] text-hotel-white/40 pt-4 border-t border-border/20 italic">
                                Published by {previewPost.author}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
