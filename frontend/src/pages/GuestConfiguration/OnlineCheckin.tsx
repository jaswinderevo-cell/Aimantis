import CustomCheckinForm from "@/components/Modals/CustomCheckinFormTemplate";
import { OnlineCheckinTable } from "@/components/OnlineCheckinTable";
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
  STRUCTURE_TYPE_LABEL,
} from "@/constants/constants";
import CredentialsIcon from "@/icons/CredentialsIcon";
import {
  CheckinTemplatePayload,
  StructureWithCheckinFormPayload,
  useGetCheckinTemplates,
  useGetStructuresByCheckinForm,
  useLinkTemplate,
  useUnlinkTemplate,
} from "@/services/onlineCheckinForm";
import { FileText } from "lucide-react";
import { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { HiOutlineTv } from "react-icons/hi2";
import { PiShieldStarLight } from "react-icons/pi";
import { VscSync, VscSyncIgnored } from "react-icons/vsc";

const OnlineCheckin = () => {
  const [activeSubTab, setActiveSubTab] = useState("structures");
  const [isOpneModal, setIsOpenModal] = useState(false);

  const [selectedTemplates, setSelectedTemplates] = useState<
    Record<number, number>
  >({});

  //get structures with checkin forms
  const structuresWithCheckinForm = useGetStructuresByCheckinForm();
  const structuresData = structuresWithCheckinForm?.data || [];

  //get checkinform templates
  const getCheckinFormTemplates = useGetCheckinTemplates();
  const checkinFormTemplates = getCheckinFormTemplates?.data || [];

  //sync or link the checkin template with structure
  const linkTemplateMutation = useLinkTemplate();

  //unsync/unlink the checkin template with structure
  const unLinkTemplateMutation = useUnlinkTemplate();

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

  const Icon = setIcon("Alloggiati");

  const renderCheckinFormContent = () => (
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
              Checkin Form
            </h3>
          </div>
          <p
            className="text-sm sm:text-[14px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Create your check in configuration
          </p>
        </div>
      </div>

      {/* Subheading + Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 my-5">
        <p
          className="text-sm sm:text-[16px]"
          style={{ color: COLOR_LIGHT_GRAY }}
        >
          Sync up your check-in to your structures 
        </p>
        <Button
          onClick={() => setIsOpenModal(true)}
          className="btn flex items-center justify-center gap-2 font-medium text-sm sm:text-[15px] px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto"
        >
          <CredentialsIcon fill="white" width="20" height="20" />
          <span>Add new Checkin form</span>
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <OnlineCheckinTable />
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
              Checkin Form
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
          <span>Add new Chekin form</span>
        </Button>
      </div>

      {/* Structures List */}
      <div className="space-y-4">
        {structuresData?.map(
          (structure: StructureWithCheckinFormPayload, index: number) => {
            return (
              <Card key={index} className="border border-gray-200">
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-2">
                        <h4
                          className="font-bold text-base sm:text-[16.8px]"
                          style={{ color: COLOR_EBONY }}
                        >
                          {structure.structure_name}
                        </h4>
                        <p className="text-sm" style={{ color: COLOR_BOULDER }}>
                          {structure.street_address}
                        </p>
                        <p className="text-sm" style={{ color: COLOR_BOULDER }}>
                          {STRUCTURE_TYPE_LABEL[structure.structure_type] ??
                            "Others"}
                          , Property types{" "}
                          {structure.total_property_types_count}, Rooms{" "}
                          {structure.total_properties_count}
                        </p>
                      </div>
                      <Badge
                        variant="default"
                        className="py-[6px] px-[10px] rounded-full font-bold text-xs bg-blue-100 text-[#3730A3] w-fit"
                      >
                        <GoDotFill
                          className={
                            structure.is_active
                              ? "text-green-600"
                              : "text-red-500"
                          }
                        />

                        <span className="capitalize">
                          {structure.is_active ? "Connected" : "Not connected"}
                        </span>
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h5
                        className="font-bold text-sm"
                        style={{ color: COLOR_EBONY }}
                      >
                        Check In form
                      </h5>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <Select
                          value={
                            selectedTemplates[structure.structure_id]
                              ? String(
                                selectedTemplates[structure.structure_id],
                              )
                              : undefined
                          }
                          onValueChange={(value) => {
                            setSelectedTemplates((prev) => ({
                              ...prev,
                              [structure.structure_id]: Number(value),
                            }));
                          }}
                        >
                          <SelectTrigger
                            className="w-full sm:w-52 lg:w-80 border-gray-300 text-black"
                            style={{ height: "40px" }}
                          >
                            <SelectValue
                              placeholder={
                                structure.checkin_form?.name || "Check in form"
                              }
                            />
                          </SelectTrigger>

                          <SelectContent className="bg-white">
                            {checkinFormTemplates.map(
                              (template: CheckinTemplatePayload) => (
                                <SelectItem
                                  key={template.id}
                                  value={String(template.id)}
                                  className="data-[highlighted]:bg-gray-100 cursor-pointer"
                                >
                                  {template.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>

                        {!structure.checkin_form ? (
                          <>
                            {/* sync button */}
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={
                                !selectedTemplates[structure.structure_id] ||
                                linkTemplateMutation.isPending
                              }
                              onClick={() => {
                                const templateId =
                                  selectedTemplates[structure.structure_id];

                                if (!templateId) return;

                                linkTemplateMutation.mutate({
                                  structure_id: structure.structure_id,
                                  template_id: templateId,
                                  is_active: true,
                                });
                              }}
                              className="text-black font-bold rounded-lg border-gray-200 hover:bg-gray-100 bg-transparent w-full sm:w-auto"
                            >
                              <VscSync />
                              Sync
                            </Button>
                          </>
                        ) : (
                          <>
                            {/* unsync button */}
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={unLinkTemplateMutation.isPending}
                              onClick={() => {
                                unLinkTemplateMutation.mutate({
                                  structure_id: structure.structure_id,
                                });
                              }}
                              className="text-black font-bold rounded-lg border-gray-200 hover:bg-gray-100 bg-transparent w-full sm:w-auto"
                            >
                              <VscSyncIgnored />
                              Unsync
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}
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
            onClick={() => setActiveSubTab("checkinForm")}
            className={`pb-3 text-sm transition-colors ${
              activeSubTab === "checkinForm"
                ? "text-[#0B0C8B] border-b-2 border-[#0B0C8B]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Check in Form
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeSubTab === "structures" && renderStructuresContent()}
        {activeSubTab === "checkinForm" && renderCheckinFormContent()}
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white p-4 sm:p-5 rounded-lg">
        {renderMainTabContent()}
      </div>
      <CustomCheckinForm open={isOpneModal} onOpenChange={setIsOpenModal} />
    </>
  );
};

export default OnlineCheckin;
