import { FaEdit } from "react-icons/fa";
import { Button } from "../ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmModal from "./ConfirmDelete";
import { StructurePayload, useDeleteStructure } from "@/services/structure";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { EditStructureModal } from "./EditDetailModals/EditStructureModal";

type StructurePopoverProps = {
  children?: React.ReactNode;
  selectedStructure: StructurePayload;
};

export function StructurePopover({
  children,
  selectedStructure,
}: StructurePopoverProps) {
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const seleCtedId = selectedStructure?.id;

  //delete structure
  const deleteStructureMutation = useDeleteStructure();

  const handleConfirmDeleteOpen = () => {
    setIsDeleteConfirmModal(true);
  };

  const handleDelete = (id: number) => {
    deleteStructureMutation.mutate(id);
  };
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          {children ? (
            children
          ) : (
            <Button variant="outline">Open popover</Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-[90px] h-10 flex items-center justify-center">
          <div className="flex justify-between gap-2">
            <div
              data-tooltip-id="edit"
              data-tooltip-content="Edit"
              className="flex items-center cursor-pointer"
              onClick={() => setIsEditModal(true)}
            >
              <FaEdit
                className="me-2 text-gray-700 hover:text-gray-900"
                size={19}
              />
              <Tooltip id="edit" />
            </div>
            <div
              data-tooltip-id="delete"
              data-tooltip-content="Delete"
              onClick={() => {
                handleConfirmDeleteOpen();
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
          </div>
        </PopoverContent>
      </Popover>

      <DeleteConfirmModal
        open={isDeleteConfirmModal}
        onCancel={() => setIsDeleteConfirmModal(false)}
        onConfirm={() => {
          if (selectedStructure && seleCtedId) {
            handleDelete(seleCtedId);
            setIsDeleteConfirmModal(false);
          }
        }}
        confirmLoading={deleteStructureMutation.isPending}
      />

      <EditStructureModal
        open={isEditModal}
        onOpenChange={(isOpen) => {
          setIsEditModal(isOpen);
        }}
        selectedStructure={selectedStructure}
      />
    </>
  );
}
