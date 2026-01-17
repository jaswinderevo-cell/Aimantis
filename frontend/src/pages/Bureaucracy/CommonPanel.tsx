import { BureaucracyTable } from "@/components/BureaucracyTable";
import AgenziaModal from "@/components/Modals/BureaucracyModals/AgenziaModal";
import AlloggiatiModal from "@/components/Modals/BureaucracyModals/AlloggiatiModal";
import IstatModal from "@/components/Modals/BureaucracyModals/IstatModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  COLOR_BOULDER,
  COLOR_EBONY,
  COLOR_LIGHT_GRAY,
  COLOR_PALE_SKY,
} from "@/constants/constants";
import CredentialsIcon from "@/icons/CredentialsIcon";
import { FileText } from "lucide-react";
import { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { HiOutlineTv } from "react-icons/hi2";
import { PiPulse, PiShieldStarLight } from "react-icons/pi";

interface StructureData {
  name: string;
  location: string;
  details: string;
  status: string;
  credential: string;
  credentials: string[];
  lastSynced: string;
  syncStatus: string;
}

const mockStructures: StructureData[] = [
  {
    name: "Structure 1",
    location: "Via Roma 123, Milano",
    details: "Apartment Complex, 2 Property types, 5 rooms",
    status: "Connected",
    credential: "Credential Name 1",
    credentials: ["Credential Name 1", "Backup Credential"],
    lastSynced: "2025-08-25",
    syncStatus: "Successfully sent data",
  },
  {
    name: "Structure 2",
    location: "Via Roma 456, Milano",
    details: "Apartment Complex, 3 Property types, 8 rooms",
    status: "not connected",
    credential: "Credential Name 2",
    credentials: ["Credential Name 2"],
    lastSynced: "2025-08-24",
    syncStatus: "Successfully sent data",
  },
];

const CommonPanel = ({ heading }: { heading: string }) => {
  const [activeSubTab, setActiveSubTab] = useState("structures");
  const [isOpneModal, setIsOpenModal] = useState(false);

  const getStatusDotColor = (status: string) => {
    switch (status) {
    case "connected":
      return "text-green-600";
    case "not connected":
      return "text-red-500";
    default:
      return "text-red-500";
    }
  };

  const setIcon = (heading: string) => {
    switch (heading) {
    case "Alloggiati":
      return PiShieldStarLight;
    case "ISTAT":
      return HiOutlineTv;
    case "Agenzia Delle Entrate":
      return FileText;
    default:
      return PiShieldStarLight;
    }
  };

  const Icon = setIcon(heading);

  const renderCredentialsContent = () => (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            <h3
              className="text-base sm:text-lg font-bold"
              style={{ color: COLOR_EBONY }}
            >
              {heading}
            </h3>
          </div>
          <p
            className="text-sm sm:text-[14px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Assign credentials to your structures
          </p>
        </div>
      </div>

      {/* Subheading + Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 my-5">
        <p
          className="text-sm sm:text-[16px]"
          style={{ color: COLOR_LIGHT_GRAY }}
        >
          Sync up your credentials to your structures
        </p>
        <Button
          onClick={() => setIsOpenModal(true)}
          className="btn flex items-center justify-center gap-2 font-medium text-sm sm:text-[15px] px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto"
        >
          <CredentialsIcon fill="white" width="20" height="20" />
          <span >Add new Credential</span>
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <BureaucracyTable />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStructuresContent = () => (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            <h3
              className="text-base sm:text-lg font-bold"
              style={{ color: COLOR_EBONY }}
            >
              {heading}
            </h3>
          </div>
          <p
            className="text-sm sm:text-[14px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Assign credentials to your structures
          </p>
        </div>
      </div>

      {/* Subheading + Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 my-5">
        <p
          className="text-sm sm:text-[16px]"
          style={{ color: COLOR_LIGHT_GRAY }}
        >
          Sync up your credentials to your structures
        </p>
        <Button
          onClick={() => setIsOpenModal(true)}
          className="btn flex items-center justify-center gap-2 font-medium text-sm sm:text-[15px] px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto"
        >
          <CredentialsIcon fill="white" width="20" height="20" />
          <span>Add new Credential</span>
        </Button>
      </div>

      {/* Structures List */}
      <div className="space-y-4">
        {mockStructures.map((structure, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent>
              <div className="space-y-6">
                {/* Top Section */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-2">
                    <h4
                      className="font-bold text-base sm:text-[16.8px]"
                      style={{ color: COLOR_EBONY }}
                    >
                      {structure.name}
                    </h4>
                    <p className="text-sm" style={{ color: COLOR_BOULDER }}>
                      {structure.location}
                    </p>
                    <p className="text-sm" style={{ color: COLOR_BOULDER }}>
                      {structure.details}
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className="py-[6px] px-[10px] rounded-full font-bold text-xs bg-blue-100 text-[#3730A3] w-fit"
                  >
                    <GoDotFill
                      className={getStatusDotColor(
                        structure.status.toLowerCase(),
                      )}
                    />
                    <span className="capitalize">{structure.status}</span>
                  </Badge>
                </div>

                {/* Bottom Section */}
                <div className="space-y-2">
                  <h5
                    className="font-bold text-sm"
                    style={{ color: COLOR_EBONY }}
                  >
                    Credential
                  </h5>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Select>
                      <SelectTrigger
                        id="structure_type"
                        className="w-full sm:w-52 lg:w-80 border-gray-300 text-black data-[placeholder]:text-gray-500"
                        style={{ height: "40px" }}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem
                          className="data-[highlighted]:bg-gray-100 cursor-pointer"
                          value="crd1"
                        >
                          Credential name 1
                        </SelectItem>
                        <SelectItem
                          className="data-[highlighted]:bg-gray-100 cursor-pointer"
                          value="crd2"
                        >
                          Credential name 2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-black font-bold rounded-lg border-gray-200 hover:bg-gray-100 bg-transparent w-full sm:w-auto"
                    >
                      <PiPulse />
                      Sync
                    </Button>
                  </div>
                  <div className="pt-2 mt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Last synced: {structure.lastSynced} -{" "}
                      {structure.syncStatus}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMainTabContent = () => (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 border-b">
          <button
            onClick={() => setActiveSubTab("structures")}
            className={`pb-3 text-sm transition-colors ${
              activeSubTab === "structures"
                ? "text-[#0B0C8B] border-b-2 border-[#0B0C8B]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Structures
          </button>
          <button
            onClick={() => setActiveSubTab("credentials")}
            className={`pb-3 text-sm transition-colors ${
              activeSubTab === "credentials"
                ? "text-[#0B0C8B] border-b-2 border-[#0B0C8B]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Credentials
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeSubTab === "structures" && renderStructuresContent()}
        {activeSubTab === "credentials" && renderCredentialsContent()}
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white p-4 sm:p-5 rounded-lg">
        {renderMainTabContent()}
      </div>
      {heading === "Alloggiati" ? (
        <AlloggiatiModal open={isOpneModal} onOpenChange={setIsOpenModal} />
      ) : heading === "ISTAT" ? (
        <IstatModal open={isOpneModal} onOpenChange={setIsOpenModal} />
      ) : (
        <AgenziaModal open={isOpneModal} onOpenChange={setIsOpenModal} />
      )}
    </>
  );
};

export default CommonPanel;
