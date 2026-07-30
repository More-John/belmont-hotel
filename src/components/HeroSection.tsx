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
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-hotel-black"
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out brightness-110 saturate-105 contrast-105"
          style={{
            backgroundImage: `url(${slide.image})`,
            opacity: i === current ? 1 : 0,
          }}
          aria-hidden={i !== current}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-hotel-black/30" />

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 text-hotel-white/70 hover:text-hotel-gold transition-colors bg-hotel-black/20 rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 text-hotel-white/70 hover:text-hotel-gold transition-colors bg-hotel-black/20 rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
      </button>

      {/* Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-3xl h-[100dvh] flex flex-col justify-between pointer-events-none py-24 md:py-32">
        <div>
          <div className="flex justify-center gap-1 mb-4 md:mb-6">
            <Star className="w-4 h-4 md:w-5 md:h-5 fill-hotel-gold text-hotel-gold" />
            <Star className="w-4 h-4 md:w-5 md:h-5 fill-hotel-gold text-hotel-gold" />
            <Star className="w-4 h-4 md:w-5 md:h-5 fill-hotel-gold text-hotel-gold" />
            <Star className="w-4 h-4 md:w-5 md:h-5 fill-hotel-gold text-hotel-gold" />
            <Star className="w-4 h-4 md:w-5 md:h-5 fill-hotel-gold text-hotel-gold" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-hotel-white tracking-wider mb-2 md:mb-4">
            BELMONT
          </h1>
          <p className="font-display text-base md:text-xl text-hotel-white tracking-[0.15em]">
            HOTEL IN ABUJA
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 pointer-events-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                i === current
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