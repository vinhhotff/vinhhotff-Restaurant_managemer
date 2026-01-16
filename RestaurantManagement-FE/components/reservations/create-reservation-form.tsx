"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ReservationDTO } from "@/lib/types";
import { ReservationService } from "@/lib/services/reservation";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";

export function CreateReservationForm({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<ReservationDTO>();

  const onSubmit = async (data: ReservationDTO) => {
    try {
      const date = new Date(data.reservationTime);
      const payload = {
          ...data,
          reservationTime: date.toISOString(),
      };
      
      await ReservationService.createReservation(payload);
      setOpen(false);
      reset();
      onSuccess();
    } catch (error) {
      console.error("Failed to create reservation", error);
      alert("Failed to create reservation");
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>New Reservation</Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Make a Reservation</h2>
          <button 
            type="button"
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Restaurant ID"
            type="number"
            {...register("restaurantId", { valueAsNumber: true, required: true })}
            placeholder="1"
          />
          <InputField
            label="Date & Time"
            type="datetime-local"
            {...register("reservationTime", { required: true })}
          />
          <InputField
            label="Guests"
            type="number"
            {...register("guestCount", { valueAsNumber: true, required: true, min: 1 })}
          />
          <InputField
            label="Notes"
            {...register("notes")}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
