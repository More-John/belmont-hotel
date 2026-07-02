"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import roomLuxury from "@/assets/room-luxury.jpg";
import roomJunior from "@/assets/room-junior.jpg";
import roomEconomy from "@/assets/room-economy.jpg";
import { RoomDetailModal, type Room } from "@/components/RoomDetailModal";

// Extended room data including modal-specific fields
const defaultRooms: Room[] = [
  {
    id: "executive",
    label: "EXECUTIVE",
    desc: "1 extra-large double bed.\nThe suite features 1 bedroom and 1 bathroom with a bath and free toiletries. The air-conditioned suite provides a flat-screen TV with cable channels, a wardrobe, an electric kettle and a sofa.",
    image: roomLuxury,
    bedType: "Extra-large double bed",
    size: "49m²",
    amenities: [
      "Free Wi-Fi",
      "Flat-screen TV",
      "Air conditioning",
      "Bath with bathtub",
      "Electric kettle",
      "Work desk",
      "Refrigerator",
      "Wake-up service",
    ],
  },
  {
    id: "deluxe-double",
    label: "DELUXE DOUBLE",
    desc: "1 large double bed. The spacious double room features air conditioning, a wardrobe, as well as a private bathroom boasting a bath. This double room offers an electric kettle and a flat-screen TV with cable channels",
    image: roomJunior,
    bedType: "Large double bed",
    size: "32m²",
    amenities: [
      "Free Wi-Fi",
      "Flat-screen TV",
      "Air conditioning",
      "Private bathroom",
      "Electric kettle",
      "Work desk",
      "Wake-up service",
    ],
  },
  {
    id: "one-bedroom",
    label: "ONE-BEDROOM",
    desc: "Simpler than the standard room but with all the necessary amenities. Every room is simply furnished and decorated and equipped with Air Conditioning, a TV and a private bathroom.",
    image: roomEconomy,
    bedType: "Double bed",
    size: "24m²",
    amenities: ["Free Wi-Fi", "TV", "Air conditioning", "Private bathroom", "Wake-up service"],
  },
];

export function RoomsSection() {
  const [rooms, setRooms] = useState(defaultRooms);
  const [activeIdx, setActiveIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/images");
        if (res.ok) {
          const data = await res.json();
          const roomImages = data.filter((img: any) => img.section === "Rooms");
          if (roomImages.length > 0) {
            setRooms((prev) => prev.map(room => {
              const uploaded = roomImages.find((img: any) => 
                  img.alt?.toLowerCase().includes(room.label.toLowerCase()) || 
                  room.label.toLowerCase().includes(img.alt?.toLowerCase() || '')
              );
              if (uploaded) {
                return { ...room, image: { src: uploaded.url, height: 0, width: 0 } as any };
              }
              return room;
            }));
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchImages();
  }, []);

  const currentRoom = rooms[activeIdx];

  const handleViewDetails = () => {
    setSelectedRoom(rooms[activeIdx]);
    setModalOpen(true);
  };

  const handleBookNow = (room: Room) => {
    // Scroll to reservation section smoothly
    const reservationSection = document.getElementById("reservation");
    if (reservationSection) {
      reservationSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="rooms"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${currentRoom.image.src})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-hotel-black/60" />

      {/* Navigation arrows */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
        <button
          onClick={() =>
            setActiveIdx((activeIdx - 1 + rooms.length) % rooms.length)
          }
          className="text-hotel-gold hover:text-hotel-white transition-colors pointer-events-auto p-2"
          aria-label="Previous room"
        >
          <ChevronLeft className="w-10 h-10 md:w-12 md:h-12" />
        </button>
        <button
          onClick={() => setActiveIdx((activeIdx + 1) % rooms.length)}
          className="text-hotel-gold hover:text-hotel-white transition-colors pointer-events-auto p-2"
          aria-label="Next room"
        >
          <ChevronRight className="w-10 h-10 md:w-12 md:h-12" />
        </button>
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center px-4 max-w-3xl w-full">
        {/* Tab navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
          {rooms.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setActiveIdx(i)}
              className={`font-body text-xs md:text-sm tracking-[0.2em] transition-colors ${i === activeIdx ? "text-hotel-gold" : "text-hotel-white"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Room title */}
        <h3 className="font-display text-4xl md:text-5xl text-hotel-white tracking-wider mb-6 transition-all duration-300">
          {currentRoom.label}
        </h3>

        {/* Room description */}
        <p className="font-body text-hotel-white/80 max-w-2xl mx-auto mb-10 leading-relaxed min-h-[80px]">
          {currentRoom.desc}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleViewDetails}
            className="border border-hotel-gold text-hotel-gold font-body tracking-wide text-sm px-8 py-3 hover:bg-hotel-gold hover:text-hotel-black transition-colors"
          >
            VIEW DETAILS
          </button>
          <button
            onClick={() => handleBookNow(currentRoom)}
            className="bg-hotel-gold text-hotel-black font-body tracking-wide text-sm px-8 py-3 hover:bg-hotel-gold/90 transition-colors"
          >
            MAKE A RESERVATION
          </button>
        </div>
      </div>

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={selectedRoom}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onBookNow={handleBookNow}
      />
    </section>
  );
}