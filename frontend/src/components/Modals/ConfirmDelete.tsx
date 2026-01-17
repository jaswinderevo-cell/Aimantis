import React from "react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Button } from "../ui/Button";

interface DeleteConfirmModalProps {
  handleDelete?: (id: number) => void;
  open: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  confirmLoading?: boolean;
}

const DeleteConfirmModal = ({
  open,
  onCancel,
  onConfirm,
  confirmLoading,
}: DeleteConfirmModalProps) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onCancel}>
        <DialogContent className="sm:max-w-[400px] max-w-[250px]">
          <div>
            <div className="w-full flex justify-around border-b-0  border-gray-300 mb-5">
              <p className="text-center text-black font-medium text-[14px]">
                Are you sure you want to delete the data?
              </p>
            </div>

            <div className="flex justify-center gap-5">
              <Button
                type="button"
                onClick={onCancel}
                className="bg-white border-1 border-gray-700 text-gray-700 hover:text-black hover:border-black text-[14px]
              hover:cursor-pointer hover:bg-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={confirmLoading}
                className="hover:cursor-pointer text-[14px] bg-red-500 hover:bg-red-600"
              >
                {confirmLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteConfirmModal;
