"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { RoomDetailModal, type Room } from "@/components/RoomDetailModal";

// Extended room data including modal-specific fields
const defaultRooms: Room[] = [
  {
    id: "business-suite",
    label: "BUSINESS SUITE",
    desc: "1 extra-large double bed.\nThe suite features 1 bedroom and 1 bathroom with a bath and free toiletries. The air-conditioned suite provides a flat-screen TV with cable channels, a wardrobe, an electric kettle and a sofa.",
    images: [
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1785419539/belmont-hotel/et5cxwtpgsoaqdztptme.jpg",
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1785419589/belmont-hotel/pff6xmd2hd2tqzglcrik.jpg",
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1785419609/belmont-hotel/qrzqio8csilffapjji0c.jpg"
    ],
    price: 107500,
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
    id: "executive-suite",
    label: "EXECUTIVE SUITE",
    desc: "1 Large Double Bed. Relax in this spacious, air-conditioned double room complete with a large double bed, wardrobe, and a private bathroom with a bathtub. Additional amenities include an electric kettle and a flat-screen TV offering a variety of cable channels.",
    images: [
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1784300284/belmont-hotel/sncwlrtxyuycylaqc6du.jpg",
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1784300534/belmont-hotel/qhvjhunjna6dix7nweat.jpg"
    ],
    price: 96750,
    bedType: "Large double bed",
    size: "38m²",
    amenities: [
      "Free Wi-Fi",
      "Flat-screen TV",
      "Air conditioning",
      "Private bathroom",
      "Electric kettle",
      "Work desk ",
      "Wake-up service",
    ],
  },
  {
    id: "executive-deluxe",
    label: "EXECUTIVE DELUXE",
    desc: "1 large double bed. The spacious double room features air conditioning, a wardrobe, as well as a private bathroom boasting a bath. This double room offers a flat-screen TV with cable channels.",
    images: [
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1784302363/belmont-hotel/enzwah6rllk0gxgnm5up.jpg",
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1784302457/belmont-hotel/huav4erxn1vktr596y3v.jpg",
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1784302492/belmont-hotel/zclp21mzxq8bsfcze8lv.jpg"
    ],
    price: 80625,
    bedType: "Large double bed",
    size: "34m²",
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
    id: "deluxe",
    label: "DELUXE ROOM",
    desc: "Simpler than the standard room but with all the necessary amenities. Every room is simply furnished and decorated and equipped with Air Conditioning, a TV and a private bathroom.",
    images: [
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1784302266/belmont-hotel/z8ldhldxmvdbm89hwpi0.jpg",
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1784302295/belmont-hotel/viudrckt6he4ky49nufz.jpg"
    ],
    price: 69875,
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
              const targetPrefix = `room-${room.id}`;
              const uploaded = roomImages.filter((img: any) => img.alt?.toLowerCase().startsWith(targetPrefix));

              if (uploaded.length > 0) {
                const sortedImages = uploaded.sort((a: any, b: any) => a.alt.localeCompare(b.alt));
                return { ...room, images: sortedImages.map((img: any) => img.url) };
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
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 bg-hotel-black brightness-110 saturate-105 contrast-105"
        style={{ backgroundImage: currentRoom?.images?.[0] ? `url(${currentRoom.images[0]})` : undefined }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-hotel-black/10" />

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
      <div className="relative z-10 text-center px-4 w-full h-[85vh] flex flex-col justify-between py-12 pointer-events-none">
        {/* Tab navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4 pointer-events-auto">
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



        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto mb-4">
          <button
            onClick={handleViewDetails}
            className="border border-hotel-gold text-hotel-gold font-body tracking-wide text-sm px-8 py-3 hover:bg-hotel-gold hover:text-hotel-black transition-colors bg-hotel-black/40 backdrop-blur-sm"
          >
            VIEW DETAILS
          </button>
          <button
            onClick={() => handleBookNow(currentRoom)}
            className="bg-hotel-gold text-hotel-black font-body tracking-wide text-sm px-8 py-3 hover:bg-hotel-gold/90 transition-colors shadow-lg"
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
