import { Trash2 } from "lucide-react";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { AddPortalModal } from "./AddPortalModal";
import { StructureUsersResponse } from "@/services/structureUsers";

interface TablePopoverProps {
  children?: React.ReactNode;
  id: number;
  handleConfirmDeleteOpen: (id: number) => void;
  handleEditModalOpen?: (user: StructureUsersResponse) => void;
  portalName?: string;
  handleEditClick?: (id: number) => void;
}

export function PortalPopover({
  id,
  handleConfirmDeleteOpen,
  portalName,
}: TablePopoverProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-end gap-2 pr-4">
      <div
        data-tooltip-id="edit"
        data-tooltip-content="Edit"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center cursor-pointer"
      >
        <FaEdit className="me-2 text-gray-700 hover:text-black" size={19} />
        <Tooltip id="edit" />
      </div>
      <div
        data-tooltip-id="delete"
        data-tooltip-content="Delete"
        onClick={() => {
          handleConfirmDeleteOpen(id);
        }}
        className="flex items-center cursor-pointer"
      >
        <Trash2
          className="text-[#C54141] hover:text-red-500"
          size={19}
          style={{ strokeWidth: "2.8px" }}
        />
        <Tooltip id="delete" />
      </div>
      <AddPortalModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        portalName={portalName}
      />
    </div>
  );
}
