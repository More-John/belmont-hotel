"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
const defaultSlides: { image: string, alt: string }[] = [];

export function HeroSection() {
  const [slides, setSlides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/images");
        if (res.ok) {
          const data = await res.json();
          const heroImages = data.filter((img: any) => img.section === "Hero");
          if (heroImages.length > 0) {
            setSlides(heroImages.map((img: any) => ({
              image: img.url,
              alt: img.alt || "Hero Image"
            })));
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchImages();
  }, []);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length]
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hotel-black"
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${slide.image})`,
            opacity: i === current ? 1 : 0,
          }}
          aria-hidden={i !== current}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-hotel-black/60" />

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 text-hotel-white/70 hover:text-hotel-gold transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 text-hotel-white/70 hover:text-hotel-gold transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
      </button>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <div className="flex justify-center gap-1 mb-6">
          <Star className="w-5 h-5 fill-hotel-gold text-hotel-gold" />
          <Star className="w-5 h-5 fill-hotel-gold text-hotel-gold" />
          <Star className="w-5 h-5 fill-hotel-gold text-hotel-gold" />
          <Star className="w-5 h-5 fill-hotel-gold text-hotel-gold" />
          <Star className="w-5 h-5 fill-hotel-gold text-hotel-gold" />
        </div>

        <h1 className="font-display text-6xl md:text-8xl font-bold text-hotel-white tracking-wider mb-4">
          BELMONT
        </h1>
        <p className="font-display text-xl md:text-2xl text-hotel-white tracking-[0.15em] mb-10">
          HOTEL IN ABUJA
        </p>

        <a
          href="#reservation"
          className="inline-block border-2 border-hotel-gold text-hotel-white font-body tracking-[0.3em] text-sm px-10 py-4 hover:bg-hotel-gold hover:text-hotel-black transition-colors"
        >
          MAKE A RESERVATION
        </a>

        <div className="mt-10 flex items-center justify-center gap-2 text-hotel-white/80 text-sm">
          <MapPin className="w-4 h-4 text-hotel-gold" />
          <span className="font-body tracking-wider">
            Plot 1032 R.I. Uzoma Street, Wuye, Abuja, 900001 Wupa, Nigeria
          </span>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current
                ? "bg-hotel-gold scale-125"
                : "bg-hotel-white/40 hover:bg-hotel-white/70"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}