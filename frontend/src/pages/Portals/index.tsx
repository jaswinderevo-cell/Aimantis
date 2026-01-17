import { AddPortalModal } from "@/components/Modals/AddPortalModal";
import { PortalsTable } from "@/components/PortalsTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { COLOR_LIGHT_BLUE } from "@/constants/constants";
import SharedBreadCrumb from "@/utils/sharedBreadCrumb";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const Portals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen " style={{ backgroundColor: COLOR_LIGHT_BLUE }}>
      <SharedBreadCrumb />
      <div className="p-3 sm:p-5">
        <AddPortalModal open={isModalOpen} onOpenChange={setIsModalOpen} />

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Left - Select */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select>
                <SelectTrigger className="text-black border-none capitalize text-lg sm:text-xl font-medium py-1 pe-4 hover:cursor-pointer w-full sm:w-fit">
                  <SelectValue placeholder="Select structure" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem
                    className="data-[highlighted]:bg-gray-100 cursor-pointer"
                    value="bliss-appartments"
                  >
                    Bliss Appartments
                  </SelectItem>
                  <SelectItem
                    className="data-[highlighted]:bg-gray-100 cursor-pointer"
                    value="tiffany-homes"
                  >
                    Tiffany Homes
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right - Button */}
            <button
              className="btn-secondary rounded-md px-3 py-2 sm:px-4 sm:py-2 font-medium flex items-center justify-center gap-2 hover:cursor-pointer text-sm sm:text-base w-full sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus className="inline" size={15} />
              Add Portal
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-5">
            <PortalsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portals;
