import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { IconX } from "@tabler/icons-react";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "../ui/Button";
import { BlockDatesModal } from "./BlockDatesModal";
import { PropertyPayload } from "@/services/rooms";

export function FrontDeskDateCellModal({
  open,
  onOpenChange,
  date,
  openCreateBookingModal,
  selectedProperty,
  selectedStructureId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  openCreateBookingModal: (open: boolean) => void;
  selectedProperty?: PropertyPayload | null;
  selectedStructureId?: number;
}) {
  const formattedDate = date ? format(date, "EEEE, dd MMMM yyyy") : "";
  const [openBlockDatesModal, setOpenBlockDatesModal] = useState(false);

  const handlOpenCreateBooking = () => {
    openCreateBookingModal(true);
    onOpenChange(false);
  };

  const handleOpenBlockDatesModal = () => {
    setOpenBlockDatesModal(true);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-4 w-[300px] rounded-lg shadow-lg">
          <div className="w-full flex justify-end">
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-gray-100 font-medium rounded-md transition"
            >
              <IconX color="red" size={20} />
            </button>
          </div>

          <div className="text-center mt-1 mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              {formattedDate}
            </h2>
            <div className="mt-1 w-10 h-0.5 bg-gray-900 mx-auto rounded-full"></div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <Button
              className="w-full text-white rounded-full py-5 text-sm font-medium bg-gray-900 hover:bg-gray-800"
              onClick={handlOpenCreateBooking}
            >
              Create booking
            </Button>
            <Button
              onClick={handleOpenBlockDatesModal}
              variant="outline"
              className="w-full border border-gray-800 rounded-full py-5 text-sm font-medium hover:bg-gray-100"
            >
              Block dates
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <BlockDatesModal
        open={openBlockDatesModal}
        onOpenChange={setOpenBlockDatesModal}
        date={date}
        selectedProperty={selectedProperty}
        selectedStructureId={selectedStructureId}
      />
    </>
  );
}
