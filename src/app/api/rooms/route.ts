import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { defaultRooms } from "@/data/defaultRooms";

const ROOM_CONFIG_CATEGORY = "__room_config__";

export async function GET() {
    try {
        const savedConfigs = await prisma.post.findMany({
            where: { category: ROOM_CONFIG_CATEGORY },
        });

        const configMap = new Map<string, any>();
        for (const item of savedConfigs) {
            try {
                const parsed = JSON.parse(item.content);
                if (parsed && parsed.id) {
                    configMap.set(parsed.id, parsed);
                }
            } catch {
                // ignore malformed json
            }
        }

        const rooms = defaultRooms.map((room) => {
            const override = configMap.get(room.id);
            if (!override) return room;
            return {
                ...room,
                label: override.label ?? room.label,
                desc: override.desc ?? room.desc,
                price: typeof override.price === "number" ? override.price : Number(override.price) || room.price,
                bedType: override.bedType ?? room.bedType,
                size: override.size ?? room.size,
                amenities: Array.isArray(override.amenities) ? override.amenities : room.amenities,
            };
        });

        return NextResponse.json(rooms);
    } catch (error) {
        console.error("Failed to fetch rooms from DB, using defaults:", error);
        return NextResponse.json(defaultRooms);
    }
}

async function handleUpdateRoom(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const body = await request.json();
        const id = searchParams.get("id") || body.id;

        if (!id) {
            return NextResponse.json({ error: "Missing room id" }, { status: 400 });
        }

        const baseRoom = defaultRooms.find((r) => r.id === id);
        if (!baseRoom) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        const numericPrice = Number(String(body.price ?? baseRoom.price).replace(/[^0-9.]/g, ""));
        if (isNaN(numericPrice) || numericPrice <= 0) {
            return NextResponse.json({ error: "Invalid room price" }, { status: 400 });
        }

        const updatedRoom = {
            id: baseRoom.id,
            label: (body.label ?? baseRoom.label).trim(),
            desc: (body.desc ?? baseRoom.desc).trim(),
            price: numericPrice,
            bedType: (body.bedType ?? baseRoom.bedType ?? "").trim(),
            size: (body.size ?? baseRoom.size ?? "").trim(),
            amenities: Array.isArray(body.amenities)
                ? body.amenities.map((a: string) => a.trim()).filter(Boolean)
                : baseRoom.amenities,
            images: baseRoom.images,
        };

        const slug = `room-config-${baseRoom.id}`;
        const serialized = JSON.stringify(updatedRoom);

        await prisma.post.upsert({
            where: { slug },
            update: {
                title: updatedRoom.label,
                excerpt: `₦${updatedRoom.price.toLocaleString()}`,
                content: serialized,
                status: "system",
            },
            create: {
                title: updatedRoom.label,
                slug,
                category: ROOM_CONFIG_CATEGORY,
                excerpt: `₦${updatedRoom.price.toLocaleString()}`,
                content: serialized,
                author: "System",
                status: "system",
            },
        });

        return NextResponse.json(updatedRoom);
    } catch (error) {
        console.error("Update room error:", error);
        return NextResponse.json({ error: "Failed to update room details" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    return handleUpdateRoom(request);
}

export async function POST(request: Request) {
    return handleUpdateRoom(request);
}
