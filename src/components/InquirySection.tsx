"use client";

import { useState } from "react";

export function InquirySection() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            subject: form.subject,
            message: form.message,
        };
        try {
            const res = await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                alert("Inquiry sent! We'll get back to you soon.");
                setForm({ name: "", email: "", phone: "", subject: "", message: "" });
            } else {
                alert("Failed to send inquiry. Please try again.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="inquiry" className="bg-background py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-wider text-center mb-12">
                    INQUIRY
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="bg-muted border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 font-body focus:outline-none focus:border-foreground"
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="bg-muted border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 font-body focus:outline-none focus:border-foreground"
                        />
                        <input
                            name="phone"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="bg-muted border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 font-body focus:outline-none focus:border-foreground"
                        />
                        <input
                            name="subject"
                            placeholder="Subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                            className="bg-muted border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 font-body focus:outline-none focus:border-foreground"
                        />
                    </div>

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="w-full bg-muted border border-border text-foreground placeholder:text-muted-foreground px-4 py-3 font-body focus:outline-none focus:border-foreground resize-y"
                    />

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="border-2 border-hotel-gold text-foreground font-body tracking-[0.3em] text-sm px-10 py-4 hover:bg-hotel-gold hover:text-hotel-white transition-colors disabled:opacity-50"
                        >
                            {loading ? "SENDING..." : "SEND"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}