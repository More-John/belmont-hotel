"use client";

import { useState, useEffect } from "react";
import { SideNav } from "@/components/SideNav";
import { Footer } from "@/components/Footer";
import { Calendar, ArrowLeft, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { defaultPosts, type PostItem } from "@/data/defaultPosts";

const CATEGORIES = ["All", "Event", "Service Update", "Blog", "News"];

export default function UpdatesPage() {
    const [posts, setPosts] = useState<PostItem[]>(defaultPosts);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [readingPost, setReadingPost] = useState<PostItem | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch("/api/posts?status=published");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        const visiblePosts = data.filter(
                            (p: any) => p.category !== "__room_config__" && !String(p.slug || "").startsWith("room-config-")
                        );
                        if (visiblePosts.length > 0) {
                            setPosts(visiblePosts);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch posts from API, using default posts:", err);
            }
        }
        fetchPosts();
    }, []);

    const filtered = posts.filter((p) => {
        const matchesCategory =
            selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.excerpt?.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="md:ml-20 min-h-screen bg-hotel-black text-hotel-white flex flex-col justify-between">
            <SideNav />

            <main className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full flex-1">
                {/* Back to Home Link */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-medium text-hotel-gold hover:text-hotel-white transition-colors uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>

                {/* Page Title */}
                <div className="text-center space-y-3 mb-12">
                    <p className="font-body text-xs text-hotel-gold tracking-[0.3em] uppercase flex items-center justify-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Belmont Hotel Stories & Announcements
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl text-hotel-white tracking-wider">
                        UPDATES, EVENTS & BLOG
                    </h1>
                    <div className="w-20 h-0.5 bg-hotel-gold mx-auto" />
                </div>

                {/* Search & Category Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                                    selectedCategory === cat
                                        ? "bg-hotel-gold text-hotel-black shadow-md"
                                        : "bg-hotel-dark text-hotel-white/70 hover:text-hotel-white border border-border/40"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-hotel-white/40" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search news & events..."
                            className="w-full bg-hotel-dark border border-border/50 rounded-lg pl-9 pr-4 py-2 text-xs text-hotel-white placeholder:text-hotel-white/40 focus:outline-none focus:border-hotel-gold"
                        />
                    </div>
                </div>

                {/* Posts Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20 bg-hotel-dark/40 rounded-lg border border-border/40 p-8">
                        <p className="text-hotel-white/60 text-sm">No updates found for this criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((post) => (
                            <article
                                key={post.id}
                                className="bg-hotel-dark border border-border/40 rounded-lg overflow-hidden flex flex-col justify-between group hover:border-hotel-gold/60 transition-all duration-300"
                            >
                                <div>
                                    <div className="relative h-48 w-full overflow-hidden bg-black/60">
                                        {post.imageUrl ? (
                                            <img
                                                src={post.imageUrl}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-hotel-white/20 text-xs">
                                                Belmont Hotel
                                            </div>
                                        )}
                                        <span
                                            className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md ${
                                                post.category === "Event"
                                                    ? "bg-amber-500 text-hotel-black"
                                                    : post.category === "Service Update"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-hotel-gold text-hotel-black"
                                            }`}
                                        >
                                            {post.category}
                                        </span>
                                    </div>

                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center gap-3 text-[11px] text-hotel-white/50">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-hotel-gold" />
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                            {post.eventDate && (
                                                <span className="text-amber-400 font-medium">
                                                    Event: {new Date(post.eventDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="font-display text-lg text-hotel-white group-hover:text-hotel-gold transition-colors line-clamp-2 leading-snug">
                                            {post.title}
                                        </h2>

                                        <p className="text-xs text-hotel-white/70 line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 pt-0">
                                    <button
                                        onClick={() => setReadingPost(post)}
                                        className="text-xs font-semibold text-hotel-gold hover:text-hotel-white transition-colors uppercase tracking-wider"
                                    >
                                        Read Details &rarr;
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            {/* Read Story Modal */}
            <Dialog open={!!readingPost} onOpenChange={() => setReadingPost(null)}>
                <DialogContent className="max-w-2xl bg-hotel-dark border-border text-hotel-white max-h-[90vh] overflow-y-auto">
                    {readingPost && (
                        <div className="space-y-5 pt-2">
                            {readingPost.imageUrl && (
                                <div className="h-64 sm:h-72 w-full rounded-lg overflow-hidden border border-border/40">
                                    <img
                                        src={readingPost.imageUrl}
                                        alt={readingPost.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-hotel-gold text-hotel-black uppercase">
                                    {readingPost.category}
                                </span>
                                <span className="text-xs text-hotel-white/50">
                                    {new Date(readingPost.createdAt).toLocaleDateString(undefined, {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                                {readingPost.eventDate && (
                                    <span className="text-xs text-amber-400 font-medium">
                                        Event Date:{" "}
                                        {new Date(readingPost.eventDate).toLocaleDateString(undefined, {
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                )}
                            </div>

                            <DialogHeader>
                                <DialogTitle className="font-display text-2xl sm:text-3xl text-hotel-white leading-tight">
                                    {readingPost.title}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="text-xs sm:text-sm text-hotel-white/80 whitespace-pre-wrap leading-relaxed border-t border-border/40 pt-4">
                                {readingPost.content}
                            </div>

                            <div className="pt-4 border-t border-border/20 flex items-center justify-between text-[11px] text-hotel-white/50 italic">
                                <span>Published by {readingPost.author}</span>
                                <span>Belmont Hotel & Suites</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}
