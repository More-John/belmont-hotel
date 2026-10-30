import { defaultRooms } from "@/data/defaultRooms";
import type { Room } from "@/components/RoomDetailModal";

export const ROOM_CONFIG_CATEGORY = "__room_config__";

export interface RoomUpdatePayload {
    id: string;
    label: string;
    price: number;
    desc: string;
    bedType: string;
    size: string;
    amenities: string[];
}

/**
 * Safely parse a fetch Response as JSON without throwing on HTML fallback pages.
 */
async function safeParseJson(res: Response): Promise<{ ok: boolean; status: number; data: any }> {
    const text = await res.text();
    const trimmed = text.trim();
    if (!trimmed || trimmed.startsWith("<")) {
        // HTML fallback (e.g., index.html or 404.html on static hosting)
        return { ok: false, status: res.status, data: null };
    }
    try {
        const parsed = JSON.parse(trimmed);
        return { ok: res.ok, status: res.status, data: parsed };
    } catch {
        return { ok: false, status: res.status, data: null };
    }
}

/**
 * Merge a list of room overrides with defaultRooms.
 */
function mergeWithDefaultRooms(overrides: any[]): Room[] {
    const map = new Map<string, any>();
    for (const item of overrides) {
        if (item && typeof item === "object" && item.id && !map.has(item.id)) {
            map.set(item.id, item);
        }
    }

    return defaultRooms.map((baseRoom) => {
        const found = map.get(baseRoom.id);
        if (!found) return baseRoom;
        return {
            ...baseRoom,
            label: found.label || baseRoom.label,
            desc: found.desc ?? baseRoom.desc,
            price:
                typeof found.price === "number"
                    ? found.price
                    : Number(String(found.price).replace(/[^0-9.]/g, "")) || baseRoom.price,
            bedType: found.bedType ?? baseRoom.bedType,
            size: found.size ?? baseRoom.size,
            amenities: Array.isArray(found.amenities) ? found.amenities : baseRoom.amenities,
        };
    });
}

/**
 * Fetch customized rooms using a 3-layer fallback:
 * 1. /api/rooms
 * 2. /api/rooms.php (direct PHP endpoint on cPanel)
 * 3. /api/posts?category=__room_config__ (existing posts endpoint on cPanel)
 */
export async function fetchRoomsFromApi(): Promise<Room[]> {
    // Layer 1 & 2: Try /api/rooms then /api/rooms.php
    for (const endpoint of ["/api/rooms", "/api/rooms.php"]) {
        try {
            const res = await fetch(endpoint, { cache: "no-store" });
            const parsed = await safeParseJson(res);
            if (parsed.ok && Array.isArray(parsed.data) && parsed.data.length > 0) {
                // Verify it actually looks like room objects (has 'id' and 'price')
                if (parsed.data[0].id && parsed.data[0].price !== undefined) {
                    return mergeWithDefaultRooms(parsed.data);
                }
            }
        } catch {
            // Try next fallback
        }
    }

    // Layer 3: Fallback to /api/posts?category=__room_config__
    for (const postsEndpoint of [
        `/api/posts?category=${ROOM_CONFIG_CATEGORY}`,
        `/api/posts.php?category=${ROOM_CONFIG_CATEGORY}`,
    ]) {
        try {
            const res = await fetch(postsEndpoint, { cache: "no-store" });
            const parsed = await safeParseJson(res);
            if (parsed.ok && Array.isArray(parsed.data)) {
                const overrides: any[] = [];
                for (const post of parsed.data) {
                    if (post?.category !== ROOM_CONFIG_CATEGORY && !String(post?.slug || "").startsWith("room-config-")) {
                        continue;
                    }
                    try {
                        const roomObj = typeof post.content === "string" ? JSON.parse(post.content) : post.content;
                        if (roomObj && roomObj.id) {
                            overrides.push(roomObj);
                        }
                    } catch {
                        // ignore invalid JSON content
                    }
                }
                if (overrides.length > 0) {
                    return mergeWithDefaultRooms(overrides);
                }
                return defaultRooms;
            }
        } catch {
            // Try next fallback
        }
    }

    return defaultRooms;
}

/**
 * Save a single room's updated details using the 3-layer fallback:
 * 1. POST /api/rooms?id=...
 * 2. POST /api/rooms.php?id=...
 * 3. PATCH/POST /api/posts (using category: "__room_config__", status: "draft")
 */
export async function saveRoomToApi(payload: RoomUpdatePayload): Promise<Room> {
    const baseRoom = defaultRooms.find((r) => r.id === payload.id);
    if (!baseRoom) {
        throw new Error("Room not found.");
    }

    // Layer 1 & 2: Try POST /api/rooms and POST /api/rooms.php
    for (const endpoint of [`/api/rooms?id=${encodeURIComponent(payload.id)}`, `/api/rooms.php?id=${encodeURIComponent(payload.id)}`]) {
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const parsed = await safeParseJson(res);
            if (parsed.ok && parsed.data && parsed.data.id) {
                return {
                    ...baseRoom,
                    ...parsed.data,
                };
            }
        } catch {
            // Continue to next layer
        }
    }

    // Layer 3: Fallback to /api/posts (or /api/posts.php) which is already active on cPanel
    const targetSlug = `room-config-${payload.id}`;
    const updatedRoom: Room = {
        ...baseRoom,
        label: payload.label,
        price: payload.price,
        desc: payload.desc,
        bedType: payload.bedType,
        size: payload.size,
        amenities: payload.amenities,
    };
    const serializedContent = JSON.stringify(updatedRoom);

    for (const basePostsUrl of ["/api/posts", "/api/posts.php"]) {
        try {
            // Check if a room config post already exists for this room
            const listRes = await fetch(`${basePostsUrl}?category=${ROOM_CONFIG_CATEGORY}`, {
                cache: "no-store",
            });
            const listParsed = await safeParseJson(listRes);

            let existingPostId: string | null = null;
            if (listParsed.ok && Array.isArray(listParsed.data)) {
                for (const post of listParsed.data) {
                    if (post?.slug === targetSlug || String(post?.slug || "").startsWith(targetSlug)) {
                        existingPostId = post.id;
                        break;
                    }
                    try {
                        const c = JSON.parse(post?.content || "{}");
                        if (c && c.id === payload.id) {
                            existingPostId = post.id;
                            break;
                        }
                    } catch {
                        // ignore
                    }
                }
            }

            if (existingPostId) {
                const patchRes = await fetch(`${basePostsUrl}?id=${encodeURIComponent(existingPostId)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: updatedRoom.label,
                        slug: targetSlug,
                        category: ROOM_CONFIG_CATEGORY,
                        excerpt: `₦${updatedRoom.price.toLocaleString()}`,
                        content: serializedContent,
                        status: "draft",
                    }),
                });
                const patchParsed = await safeParseJson(patchRes);
                if (patchParsed.ok && patchParsed.data) {
                    return updatedRoom;
                }
            }

            // Create new room config post via POST
            const postRes = await fetch(basePostsUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: updatedRoom.label,
                    slug: targetSlug,
                    category: ROOM_CONFIG_CATEGORY,
                    excerpt: `₦${updatedRoom.price.toLocaleString()}`,
                    content: serializedContent,
                    author: "System",
                    status: "draft",
                }),
            });
            const postParsed = await safeParseJson(postRes);
            if (postParsed.ok && postParsed.data) {
                return updatedRoom;
            }
        } catch {
            // Try next basePostsUrl
        }
    }

    throw new Error("Could not save room details. Please verify your connection and try again.");
}
