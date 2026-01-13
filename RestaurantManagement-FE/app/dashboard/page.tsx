"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { ReservationList } from "@/components/reservations/reservation-list";
import { CreateReservationForm } from "@/components/reservations/create-reservation-form";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userStr));
  }, [router]);

  const handleLogout = async () => {
      try {
          await api.post("/auth/logout");
      } catch (e) {
          console.error(e);
      }
      localStorage.removeItem("user");
      router.push("/login"); // Fixed: using push instead of reload for SPA feel
  }

  const handleReservationSuccess = () => {
      setRefreshKey(old => old + 1);
  };

  if (!user) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Dashboard
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user.fullName}</span>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>
            </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Your Reservations</h2>
                    <CreateReservationForm onSuccess={handleReservationSuccess} />
                </div>
                
                <ReservationList key={refreshKey} />
            </div>
        </main>
    </div>
  );
}
