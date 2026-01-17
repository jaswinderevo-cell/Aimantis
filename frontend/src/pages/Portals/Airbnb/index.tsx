import { Label } from '@/components/ui/Label';
import {
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GRAY,
  COLOR_LIGHT_SILVER,
} from '@/constants/constants';
import { IconX } from '@tabler/icons-react';
import React from 'react';

interface AirbnbPortalProps {
  resetForm: () => void;
  onOpenChange: (open: boolean) => void;
}

const AirbnbPortal: React.FC<AirbnbPortalProps> = ({
  resetForm,
  onOpenChange,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[20px] text-black font-semibold">Add Airbnb </h2>
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
              You must connect with a main host account. Co-hosts accounts
              cannot be connected.
            </li>
            <li>
              In order to establish the connection, your listings must be set to
              Listed on Airbnb.
            </li>
            <li>
              If you are using "Smart prices" Airbnb will set your prices back
              to base price.
            </li>
            <li>
              If you are using "Rule-sets", please note these will be cleared
              from your Airbnb calendar and you will need to re-apply them again
              to any desired dates.
            </li>
          </ol>
        </div>

        <div>
          <p className="text-black text-[15px] font-bold">INSTRUCTIONS:</p>
          <ol
            className="text-[16px] mt-4 font-medium space-y-2 list-decimal list-inside"
            style={{ color: COLOR_LIGHT_GRAY }}
          >
            <li>Click on "Connect new account".</li>
            <li>
              You will be redirected to Airbnb. Confirm the connection in
              Airbnb.
            </li>
            <li>
              Click "Not connected" and match the accommodation to the
              corresponding Airbnb listing. You may have to click on "Reload".
              Save.
            </li>
          </ol>
        </div>
      </div>

      <div className="w-full mt-10">
        <Label
          className="text-[14px] mb-2 font-medium"
          style={{ color: COLOR_LIGHT_GRAY }}
        >
          Connected Accounts
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

export default AirbnbPortal;
