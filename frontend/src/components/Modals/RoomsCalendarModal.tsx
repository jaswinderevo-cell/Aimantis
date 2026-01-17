"use client";

import { CalendarDays, DollarSign, Moon } from "lucide-react";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hotelName: string;
  dateRange: { start: string; end: string };
  price?: number | null;
  availability?: number | null;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  hotelName,
  dateRange,
  price,
  availability,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Confirmation
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Please review and confirm the changes you made to the calendar.
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="font-medium">{hotelName}</div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarDays size={18} className="text-gray-500" />
            {dateRange.start} → {dateRange.end}
          </div>

          {price !== null && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <DollarSign size={18} className="text-gray-500" />
              {price} €
            </div>
          )}

          {availability !== null && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Moon size={18} className="text-gray-500" />
              {availability}
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Discard changes
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-black text-white hover:bg-gray-800"
          >
            Synchronize Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
