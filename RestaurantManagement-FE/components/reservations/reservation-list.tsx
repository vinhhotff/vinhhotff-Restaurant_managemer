"use client";

import { useEffect, useState } from "react";
import { Reservation } from "@/lib/types";
import { ReservationService } from "@/lib/services/reservation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const data = await ReservationService.getAllReservations();
      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch reservations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      await ReservationService.deleteReservation(id);
      fetchReservations();
    }
  };

  if (loading) return <div>Loading reservations...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        reservations.map((res) => (
          <Card key={res.id}>
            <CardHeader>
              <CardTitle>Reservation #{res.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Time: {new Date(res.reservationTime).toLocaleString()}</p>
              <p>Guests: {res.guestCount}</p>
              <p>Status: {res.status}</p>
              <Button 
                variant="destructive" 
                size="sm" 
                className="mt-2"
                onClick={() => handleDelete(res.id)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
