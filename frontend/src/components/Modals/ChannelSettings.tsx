import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import AvailabiltySettingsForm from "../AvailabiltySettingsForm";
import PriceSettingsForm from "../PriceSettingsForm";
import { Dialog, DialogContent } from "../ui/Dialog";

const ChannelSettingsModal = ({
  open,
  onOpenChange,
  selectedStructureId,
}: {
  selectedStructureId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [activeModal, setActiveModal] = useState<"availability" | "price">(
    "availability",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[700px] xl:max-w-[700px] max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[20px] text-black font-semibold">
            Channels Settings
          </h2>
          <button className="cursor-pointer hover:bg-gray-100 rounded-md">
            <IconX color="red" onClick={() => onOpenChange(false)} />
          </button>
        </div>
        <div className="flex gap-5 my-4 border-b border-gray-200">
          <button
            onClick={() => setActiveModal("availability")}
            className={`pb-3 text-sm transition-colors ${
              activeModal === "availability"
                ? "text-[#0B0C8B] border-b-2 border-[#0B0C8B]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Availability Settings
          </button>

          <button
            onClick={() => setActiveModal("price")}
            className={`pb-3 text-sm transition-colors ${
              activeModal === "price"
                ? "text-[#0B0C8B] border-b-2 border-[#0B0C8B]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Price Settings
          </button>
        </div>

        {/* Render only one component based on activeModal */}
        {activeModal === "availability" && <AvailabiltySettingsForm selectedStructureId={selectedStructureId}/>}
        {activeModal === "price" && <PriceSettingsForm />}
      </DialogContent>
    </Dialog>
  );
};

export default ChannelSettingsModal;
