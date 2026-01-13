"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Status = "loading" | "ready" | "error";

type ReservationSummary = {
  id: number;
  reservationCode: string;
  reservationDate: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [reservations, setReservations] = useState<ReservationSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await api.get("/api/reservations");
        if (!isMounted) {
          return;
        }

        const items = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        const mapped = items.slice(0, 3).map((item: any) => ({
          id: item.id,
          reservationCode: item.reservationCode,
          reservationDate: item.reservationDate,
        }));

        setReservations(mapped);
        setStatus("ready");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setStatus("error");
        setErrorMessage(
          "We could not load reservations. Confirm your session is active."
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      router.push("/login");
    }
  };

  return (
    <Card>
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          A quick view of your most recent reservations. Use this area as a
          starting point for your management tools.
        </p>
      </div>

      {status === "loading" && (
        <p className="text-sm text-muted-foreground">Loading reservations…</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      {status === "ready" && reservations.length > 0 && (
        <ul className="mb-6 space-y-3 text-sm text-foreground">
          {reservations.map((reservation) => (
            <li
              key={reservation.id}
              className="flex items-center justify-between rounded-md border border-border bg-card/60 px-4 py-3"
            >
              <span className="font-medium">{reservation.reservationCode}</span>
              <span className="text-muted-foreground">
                {reservation.reservationDate}
              </span>
            </li>
          ))}
        </ul>
      )}

      {status === "ready" && reservations.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No reservations found yet. Start by creating a new reservation in the
          management console.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 text-sm">
        <Link href="/" className="text-primary hover:underline">
          Return home
        </Link>
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </Card>
  );
}
