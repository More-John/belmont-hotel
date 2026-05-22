import { AdminReservations } from "@/components/admin/AdminReservations";

export default function ReservationsPage() {
    return (
        <div>
            <h1 className="font-display text-2xl mb-6">Reservations</h1>
            <AdminReservations />
        </div>
    );
}