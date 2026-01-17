import { SharedCheckinForm } from "@/components/SharedCheckinForm";
import { useParams } from "react-router-dom";

const PublicCheckinPage = () => {
  const { bookingUid } = useParams<{ bookingUid: string }>();

  if (!bookingUid) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center p-4">
      <SharedCheckinForm bookingUid={bookingUid} mode="guest" />
    </div>
  );
};

export default PublicCheckinPage;
