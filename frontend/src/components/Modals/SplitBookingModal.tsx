import { COLOR_EBONY, COLOR_OXFORD_BLUE } from "@/constants/constants";
import {
  BookingPayload,
  SplitBookingPayload,
  useSplitBooking,
} from "@/services/bookings";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import { IconX } from "@tabler/icons-react";
import { format, isValid, parseISO } from "date-fns";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { Label } from "../ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { useFormStatus } from "@/utils/disableFormHook";

interface SplitBookingModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  booking: BookingPayload | null;
  selectedStructureId: number;
}

export default function SplitBookingModal({
  open,
  onOpenChange,
  booking,
  selectedStructureId,
}: SplitBookingModalProps) {
  const [roomId, setRoomId] = useState<number | null>(
    booking ? booking.property : 0,
  );

  const { data: rooms = [] } = useGetAllRooms();

  const filteredRooms = useMemo(() => {
    return (
      rooms?.filter(
        (r: PropertyPayload) => r.structure === selectedStructureId,
      ) || []
    );
  }, [rooms, selectedStructureId]);

  //split booking
  const splitBookingMutation = useSplitBooking();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik<SplitBookingPayload>({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      booking_id: booking?.id ?? null,
      new_room_id: roomId ?? 0,
      split_date: "",
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      splitBookingMutation.mutate(values, {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
          setSubmitting(false);
        },
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  });

  //date parsing
  const checkIn = booking?.check_in_date
    ? parseISO(booking.check_in_date)
    : null;
  const checkOut = booking?.check_out_date
    ? parseISO(booking.check_out_date)
    : null;

  //check if dates rendered
  const datesReady =
    checkIn && checkOut && isValid(checkIn) && isValid(checkOut);

  const minSplitDate = datesReady
    ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000)
    : null;

  const maxSplitDate = datesReady
    ? new Date(checkOut.getTime() - 24 * 60 * 60 * 1000)
    : null;

  const isValidSplit =
    values.split_date &&
    minSplitDate &&
    maxSplitDate &&
    (() => {
      const d = parseISO(values.split_date);
      return isValid(d) && d >= minSplitDate && d <= maxSplitDate;
    })() &&
    roomId;

  //check if booking and rooms are rendred
  useEffect(() => {
    if (booking && rooms.length > 0) {
      setRoomId(booking.property);
    }
  }, [booking, rooms]);

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: splitBookingMutation.isPending,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto p-5">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle
                className="text-2xl font-bold"
                style={{ color: COLOR_EBONY }}
              >
                Split Booking
              </DialogTitle>

              <p
                className="mt-1 text-sm break-words mr-5 hidden md:block"
                style={{ color: COLOR_OXFORD_BLUE }}
              >
                Create a new reservation for your property 
              </p> 
            </div>

            <button className="hover:bg-gray-100 rounded-lg">
              <IconX
                color="red"
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={isFormDisabled}>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                {/* Safe date display */}
                {datesReady ? (
                  <p
                    className="text-lg font-semibold text-center md:text-left"
                    style={{ color: COLOR_EBONY }}
                  >
                    {format(checkIn, "dd MMM yyyy")} →{" "}
                    {format(checkOut, "dd MMM yyyy")}
                  </p>
                ) : (
                  <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mx-auto md:mx-0" />
                )}

                {/* Booking reference */}
                {booking && (
                  <div className="flex text-sm text-gray-700 mx-auto justify-center md:justify-start gap-5">
                    <p className="font-medium">
                      Booking ID:{" "}
                      <span className="font-normal">{booking.id}</span>
                    </p>

                    <p className="font-medium">
                      Guest:{" "}
                      <span className="font-normal">
                        {booking.guests[0].full_name}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {datesReady && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                  {/* Split date selector */}
                  <div className="space-y-2">
                    <Label>Select split date</Label>

                    <DatePicker
                      value={values.split_date}
                      onChange={(val) => {
                        if (!val) {
                          setFieldValue("split_date", "");
                          return;
                        }

                        const selected = parseISO(val);

                        if (
                          minSplitDate &&
                          maxSplitDate &&
                          selected >= minSplitDate &&
                          selected <= maxSplitDate
                        ) {
                          setFieldValue(
                            "split_date",
                            format(selected, "yyyy-MM-dd"),
                          );
                        } else {
                          setFieldValue("split_date", "");
                        }
                      }}
                      disableDate={(date) => {
                        if (!minSplitDate || !maxSplitDate) return false;
                        return date < minSplitDate || date > maxSplitDate;
                      }}
                      width="100%"
                      height="44px"
                    />
                  </div>

                  {/* Room selector */}
                  <div className="space-y-2">
                    <Label>
                      Select room<span className="text-xs">(optional)</span>
                    </Label>

                    <Select
                      value={String(roomId)}
                      onValueChange={(val) => setRoomId(Number(val))}
                    >
                      <SelectTrigger className="h-[44px] w-full border border-gray-300">
                        <SelectValue placeholder="Choose room" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {filteredRooms?.map((room: PropertyPayload) => (
                          <SelectItem
                            key={room.id}
                            value={String(room.id)}
                            className="data-[highlighted]:bg-gray-100 cursor-pointer"
                          >
                            {room.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-5">
              <Button
                type="button"
                variant="outline"
                className="hover:bg-gray-100"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                className="btn"
                type="submit"
                disabled={!isValidSplit || splitBookingMutation.isPending}
              >
                Confirm Split
              </Button>
            </DialogFooter>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
