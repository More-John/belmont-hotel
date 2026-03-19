"use client";

const testimonials = [
    {
        name: "COLIN",
        text: "Excellent service and staff in general. Would definitely recommend",
    },
    {
        name: "PRAISE",
        text: "The breakfast was awesome! You're given options to choose from the menu, and it was great. The restaurant service was excellent; the food was nice and served in a satisfying quantity. Generally, the hotel is clean with good facilities for maximum comfort. The hotel staff were super amazing – respectful, friendly, and diligent in their duties. I really look forward to another stay and saying hello to those wonderful staff, especially the front desk team; they were really amazing. Kudos to the restaurant for doing a great job with those tasty dishes.",
    },
    {
        name: "BABAFEMI",
        text: "“I had a pleasant stay at the hotel. The reception by the staff was warm.”",
    },
];

export function TestimonialsSection() {
    return (
        <section className="bg-hotel-gray py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-wider text-center mb-14">
                    TESTIMONIALS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((t) => (
                        <div key={t.name}>
                            <span className="font-display text-4xl text-hotel-gold leading-none">"</span>
                            <p className="font-body text-muted-foreground leading-relaxed mb-6">
                                {t.text}
                            </p>
                            <p className="font-body text-sm font-bold tracking-[0.15em] text-foreground">
                                {t.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}