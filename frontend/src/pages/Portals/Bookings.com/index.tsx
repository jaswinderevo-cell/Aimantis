import { Label } from '@/components/ui/Label';
import {
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GRAY,
  COLOR_LIGHT_SILVER,
} from '@/constants/constants';
import { IconX } from '@tabler/icons-react';

interface BookingsPortalProps {
  resetForm: () => void;
  onOpenChange: (open: boolean) => void;
}

const BookingsPortal: React.FC<BookingsPortalProps> = ({
  resetForm,
  onOpenChange,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[20px] text-black font-semibold">
          Add Booking.com
        </h2>
        <IconX
          color="red"
          className="cursor-pointer hover:bg-gray-100 rounded-md"
          onClick={() => {
            resetForm();
            onOpenChange(false);
          }}
        />
      </div>
      <div
        className="flex flex-col mt-5 p-4 rounded-lg items-start gap-[24px]"
        style={{ backgroundColor: COLOR_LIGHT_BLUE }}
      >
        <div>
          <p className="text-black text-[15px] font-bold">
            BEFORE YOU GET STARTED:
          </p>
          <ol
            className="text-[16px] mt-4 font-medium space-y-2 list-disc list-inside"
            style={{ color: COLOR_LIGHT_GRAY }}
          >
            <li>
              If you have multiple property ID, repeat all 5 steps below for
              each property ID.
            </li>
            <li>
              Please note that the initial import only supplies limited booking
              data.
            </li>
            <li>
              New bookings will provide the full data set and all contact info.
            </li>
          </ol>
        </div>

        <div>
          <p className="text-black text-[15px] font-bold">INSTRUCTIONS:</p>
          <ol
            className="text-[16px] mt-4 font-medium space-y-2 list-decimal list-inside"
            style={{ color: COLOR_LIGHT_GRAY }}
          >
            <li>
              Go to Booking-Extranet / Account / Connectivity Provider / Search
              for "Aimantis"
            </li>
            <li>
              Select Aimantis and click through to accept the full connection
            </li>
            <li>
              The message "Pending Provider Setup" will show, however no need to
              wait!
            </li>
            <li>
              In Aimantis: Please enter your Booking.com ID on this page under
              "Property ID" below, press Save
            </li>
            <li>
              In Aimantis: Below, need to map every Property. Click "Not
              connected" and match the corresponding Booking.com listing. Press
              Save
            </li>
          </ol>
        </div>
      </div>

      <div className="w-full mt-10">
        <Label
          className="text-[14px] mb-2 font-medium"
          style={{ color: COLOR_LIGHT_GRAY }}
        >
          Property ID (Hotel ID)
        </Label>
        <input
          placeholder="ID"
          className="text-black w-full h-[40px] border-1 rounded px-1 text-[17px]"
          style={{ borderColor: COLOR_LIGHT_SILVER }}
        />
      </div>
    </div>
  );
};

export default BookingsPortal;
