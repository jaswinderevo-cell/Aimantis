import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Moon, X } from "lucide-react";
import { MdEuro } from "react-icons/md";
import { Button } from "../ui/Button";

export type InputData = {
  propertyId: number | "";
  propertyName: string;
  date: string;
  basePrice: number | "";
  minNight: number | "";
};

type SlideConfirmationModalProps = {
  isOpen: boolean;
  inputData: InputData;
  onClose: () => void;
  onDiscard: () => void;
  onSynchronize: () => void;
};

export default function PriceConfirmationModal({
  isOpen,
  inputData,
  onDiscard,
  onSynchronize,
}: SlideConfirmationModalProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="price-confirmation-modal"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 sm:bg-black/20"
            onClick={onDiscard}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
            }}
            className="
              absolute bottom-0 right-0
              w-full sm:w-[420px]
              sm:bottom-4 sm:right-4
              bg-white border border-gray-200
              rounded-t-xl sm:rounded-lg
              shadow-xl
              p-4 sm:p-5
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmation
              </h3>
              <button
                onClick={onDiscard}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <X size={20} className="text-red-500" />
              </button>
            </div>

            {/* Body */}
            <p className="text-sm text-gray-600 mb-4">
              Please review and confirm the changes you made <br />
              to the calendar.
            </p>

            <div className="space-y-3 mb-4">
              <div className="font-medium text-gray-900">
                Property – {inputData.propertyName}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>{inputData.date}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MdEuro size={16} />
                <span>{inputData.basePrice}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Moon size={16} />
                <span>{inputData.minNight}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={onDiscard}
                variant="ghost"
                className="w-full sm:flex-1"
              >
                Discard changes
              </Button>

              <Button onClick={onSynchronize} className="btn w-full sm:flex-1">
                Synchronize Now
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
