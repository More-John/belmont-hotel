"use client";

import { useState, useEffect } from "react";
import { Calendar, ArrowRight, Sparkles, Tag, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export interface PostItem {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    imageUrl: string | null;
    author: string;
    status: string;
    eventDate: string | null;
    createdAt: string;
}

export function UpdatesSection() {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [readingPost, setReadingPost] = useState<PostItem | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch("/api/posts?status=published");
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (err) {
                console.error("Failed to load updates", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    const categories = ["All", "Event", "Service Update", "Blog", "News"];

    const filtered = posts.filter((p) => {
        if (selectedCategory === "All") return true;
        return p.category.toLowerCase() === selectedCategory.toLowerCase();
    });

    if (!loading && posts.length === 0) {
        return null; // Don't render empty section
    }

    return (
        <section id="updates" className="bg-hotel-dark py-24 px-4 sm:px-8 border-t border-border/30">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Section Header */}
                <div className="text-center space-y-3">
                    <p className="font-body text-xs text-hotel-gold tracking-[0.3em] uppercase flex items-center justify-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        What's Happening at Belmont
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl text-hotel-white tracking-wider">
                        UPDATES & EVENTS
                    </h2>
                    <div className="w-16 h-0.5 bg-hotel-gold mx-auto" />
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all ${
                                selectedCategory === cat
                                    ? "bg-hotel-gold text-hotel-black font-semibold shadow-md"
                                    : "bg-black/30 text-hotel-white/70 hover:text-hotel-white border border-border/40"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="text-center py-12 text-hotel-white/50 text-xs">
                        Loading latest updates...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.slice(0, 6).map((post) => (
                            <article
                                key={post.id}
                                className="bg-black/40 border border-border/40 rounded-lg overflow-hidden flex flex-col justify-between group hover:border-hotel-gold/60 transition-all duration-300"
                            >
                                <div>
                                    {/* Image */}
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

                                    {/* Content */}
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center gap-3 text-[11px] text-hotel-white/50">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-hotel-gold" />
                                                {new Date(post.createdAt).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            {post.eventDate && (
                                                <span className="text-amber-400 font-medium">
                                                    Event Date:{" "}
                                                    {new Date(post.eventDate).toLocaleDateString(undefined, {
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-display text-lg text-hotel-white group-hover:text-hotel-gold transition-colors line-clamp-2 leading-snug">
                                            {post.title}
                                        </h3>

                                        <p className="text-xs text-hotel-white/70 line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </div>

                                {/* Read More Link */}
                                <div className="p-6 pt-0">
                                    <button
                                        onClick={() => setReadingPost(post)}
                                        className="text-xs font-semibold text-hotel-gold hover:text-hotel-white flex items-center gap-2 group-hover:translate-x-1 transition-all"
                                    >
                                        <span>Read Full Story</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

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
                                        Event:{" "}
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
        </section>
    );
}
