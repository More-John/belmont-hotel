"use client";

import { useState } from "react";

export function InquirySection() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <section id="inquiry" className="bg-background py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-wider text-center mb-12">
                    INQUIRY
                </h2>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
                            className="bg-muted border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 font-body focus:outline-none focus:border-foreground" />
                        <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange}
                            className="bg-muted border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 font-body focus:outline-none focus:border-foreground" />
                        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
                            className="bg-muted border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 font-body focus:outline-none focus:border-foreground" />
                    </div>

                    <textarea name="message" placeholder="Your Message" rows={6} value={form.message} onChange={handleChange}
                        className="w-full bg-muted border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 font-body focus:outline-none focus:border-foreground resize-y" />

                    <div className="text-center">
                        <button type="submit"
                            className="border-2 border-hotel-gold text-foreground font-body tracking-[0.3em] text-sm px-10 py-4 hover:bg-hotel-gold hover:text-hotel-white transition-colors">
                            SEND
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}