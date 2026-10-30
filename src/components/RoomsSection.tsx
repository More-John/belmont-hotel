"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { RoomDetailModal, type Room } from "@/components/RoomDetailModal";
import { defaultRooms } from "@/data/defaultRooms";
import { fetchRoomsFromApi } from "@/lib/roomsApi";

export function RoomsSection() {
  const [rooms, setRooms] = useState<Room[]>(defaultRooms);
  const [activeIdx, setActiveIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    async function fetchRoomsAndImages() {
      let updatedRooms = [...defaultRooms];

      // 1. Fetch customized room details (price, description, bedType, size, amenities)
      try {
        const roomData = await fetchRoomsFromApi();
        if (Array.isArray(roomData) && roomData.length > 0) {
          updatedRooms = roomData;
        }
      } catch (err) {
        console.error("Failed to fetch room details:", err);
      }

      // 2. Fetch uploaded room gallery images
      try {
        const imgRes = await fetch("/api/images");
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (Array.isArray(imgData)) {
            const roomImages = imgData.filter((img: any) => img.section === "Rooms");
            if (roomImages.length > 0) {
              updatedRooms = updatedRooms.map((room) => {
                const targetPrefix = `room-${room.id}`;
                const uploaded = roomImages.filter((img: any) =>
                  img.alt?.toLowerCase().startsWith(targetPrefix)
                );
                if (uploaded.length > 0) {
                  const sortedImages = uploaded.sort((a: any, b: any) =>
                    (a.alt || "").localeCompare(b.alt || "")
                  );
                  return { ...room, images: sortedImages.map((img: any) => img.url) };
                }
                return room;
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch room images:", err);
      }

      setRooms(updatedRooms);
    }

    fetchRoomsAndImages();
  }, []);

  const currentRoom = rooms[activeIdx];

  const handleViewDetails = () => {
    setSelectedRoom(rooms[activeIdx]);
    setModalOpen(true);
  };

  const handleBookNow = (room: Room) => {
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
              className={`font-body text-xs md:text-sm tracking-[0.2em] transition-colors ${
                i === activeIdx ? "text-hotel-gold" : "text-hotel-white"
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
