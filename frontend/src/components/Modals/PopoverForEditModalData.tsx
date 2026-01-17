import { PropertyPayload } from "@/services/rooms";
import { Trash2 } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { RiHotelBedLine } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface TablePopoverProps {
  children?: React.ReactNode;
  property: PropertyPayload;
  handleEditClick: (property: PropertyPayload) => void;
  handleConfirmDeleteOpen: (id: number) => void;
}

export function TablePopoverForEditModalData({
  property,
  handleEditClick,
  handleConfirmDeleteOpen,
}: TablePopoverProps) {
  return (
    <div className="flex items-center justify-center sm:justify-start gap-6">
      {/* Edit */}
      <div
        data-tooltip-id="edit"
        data-tooltip-content="Edit"
        className="flex items-center cursor-pointer"
      >
        <button
          onClick={() => handleEditClick(property)}
          className="flex items-center text-gray-700 hover:text-black"
        >
          <FaEdit size={19} />
        </button>
        <Tooltip id="edit" />
      </div>

      {/* Bed */}
      <div
        data-tooltip-id="checkin"
        data-tooltip-content="Checkin"
        className="flex items-center cursor-pointer"
      >
        <button className="flex items-center text-gray-700 hover:text-black">
          <RiHotelBedLine size={22} />
        </button>
        <Tooltip id="checkin" />
      </div>

      {/* Delete */}
      <div data-tooltip-id="delete" data-tooltip-content="Delete">
        <button
          onClick={() => handleConfirmDeleteOpen(property?.id as number)}
          className="flex items-center text-[#C54141] hover:text-red-500"
        >
          <Trash2 size={19} style={{ strokeWidth: "2.8px" }} />
        </button>
        <Tooltip id="delete" />
      </div>
    </div>
  );
}
