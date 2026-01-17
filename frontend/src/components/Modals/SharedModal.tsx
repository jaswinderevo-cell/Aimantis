import { Button } from "@/components/ui/Button";
import { IconX } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

interface DialogModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export function SharedModal({
  open,
  title,
  description,
  onClose,
  children,
}: DialogModalProps) {
  const showInfoOnly = !children;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`p-0 ${showInfoOnly ? "!max-w-md" : "w-full !max-w-2xl"}`}
      >
        {showInfoOnly && (
          <>
            <DialogHeader>
              {title && <DialogTitle className="flex">{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>

            <div className="flex justify-end pt-4">
              <Button className="btn" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        )}

        {children && (
          <div className="relative max-h-[75vh] overflow-auto">
            <div className="relative">{children}</div>

            <IconX
              onClick={onClose}
              color="red"
              className="absolute top-8 right-0 hover:bg-gray-100 rounded-md cursor-pointer"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
