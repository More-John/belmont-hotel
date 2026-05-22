"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Reservation = {
    id: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    persons: number;
    specialRequests: string | null;
    status: string;
    createdAt: string;
};

export function AdminReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        const res = await fetch("/api/reservations");
        const data = await res.json();
        setReservations(data);
        setLoading(false);
    };

    if (loading) return <div>Loading reservations...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reservations</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Guest</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reservations.map((res) => (
                            <TableRow key={res.id}>
                                <TableCell>{res.guestName}</TableCell>
                                <TableCell>{res.guestEmail}</TableCell>
                                <TableCell>{res.roomType}</TableCell>
                                <TableCell>{format(new Date(res.checkIn), "PPP")}</TableCell>
                                <TableCell>{format(new Date(res.checkOut), "PPP")}</TableCell>
                                <TableCell>
                                    <Badge variant={res.status === "pending" ? "outline" : "default"}>{res.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}