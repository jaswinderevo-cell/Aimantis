import { ROUTES } from "@/constants/routes";
import { useGetCheckinTemplateByBookingUid } from "@/services/onlineCheckinForm";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiHotelBedLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { SharedCheckinForm } from "../SharedCheckinForm";
import { SharedModal } from "./SharedModal";

interface TablePopoverProps {
  children?: React.ReactNode;
  route: string;
  id: number;
  uid?: string;
  handleConfirmDeleteOpen: (id: number) => void;
  handleCheckinModalOPen: (id: number) => void;
}

export function TablePopover({
  route,
  id,
  uid,
  handleConfirmDeleteOpen,
  handleCheckinModalOPen,
}: TablePopoverProps) {
  const navigate = useNavigate();
  const [checkClicked, setCheckClicked] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showNoCheckinDialog, setShowNoCheckinDialog] = useState(false);

  const { data, isLoading, isError } = useGetCheckinTemplateByBookingUid(
    uid,
    checkClicked,
  );

  const handleNavigate = (id: string, fromFrontDesk: boolean) => {
    const finalRoute = route.replace(":id", id.toString());
    navigate(finalRoute, { state: { fromFrontDesk } });
  };

  //for copy checkin url
  const guestCheckinUrl = `${window.location.origin}${ROUTES.PUBLIC_CHECKIN_PAGE.replace(
    ":bookingUid",
    uid!,
  )}`;

  const handleCheckinClick = () => {
    if (!uid) {
      setShowNoCheckinDialog(true);
      return;
    }
    setCheckClicked(true);
  };

  useEffect(() => {
    if (!checkClicked) return;

    if (!isLoading) {
      if (!data?.template?.id) {
        setShowNoCheckinDialog(true);
        setCheckClicked(false);
        return;
      }

      setShowCheckinModal(true);
      setCheckClicked(false);
    }
  }, [checkClicked, isLoading, data]);

  return (
    <div className="flex items-center justify-center sm:justify-start gap-6">
      <div
        className="flex items-center cursor-pointer"
        data-tooltip-id="edit"
        data-tooltip-content="Edit"
      >
        <button
          onClick={() => handleNavigate(id.toString(), false)}
          className="flex items-center text-gray-700 hover:text-black"
        >
          <FaEdit size={19} />
        </button>
        <Tooltip id="edit" />
      </div>
      <div
        className="flex items-center cursor-pointer"
        data-tooltip-id="checkin"
        data-tooltip-content="Checkin"
      >
        <button
          onClick={handleCheckinClick}
          disabled={isLoading}
          className="flex items-center text-gray-700 hover:text-black disabled:opacity-50"
        >
          <RiHotelBedLine size={22} />
        </button>
        <Tooltip id="checkin" />
      </div>
      <div
        className="flex items-center cursor-pointer transition-colors duration-200 ease-in-out text-red-400 hover:text-red-500"
        data-tooltip-id="delete"
        data-tooltip-content="Delete"
      >
        <button
          onClick={() => handleConfirmDeleteOpen(id)}
          className="flex items-center text-[#C54141] hover:text-red-500"
        >
          <Trash2 size={19} style={{ strokeWidth: "2.8px" }} />
        </button>
        <Tooltip id="delete" />
      </div>

      <SharedModal
        open={showNoCheckinDialog}
        title="Check-in not available"
        description="No check-in form is connected to this booking yet."
        onClose={() => setShowNoCheckinDialog(false)}
      />

      <SharedModal
        open={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
      >
        <SharedCheckinForm
          guestCheckinUrl={guestCheckinUrl}
          bookingUid={uid!}
          mode="staff"
          onClose={() => setShowCheckinModal(false)}
        />
      </SharedModal>
    </div>
  );
}
