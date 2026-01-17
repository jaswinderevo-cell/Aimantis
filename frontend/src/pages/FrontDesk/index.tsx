import FrontDesk from "@/components/FrontDesk";
import { CreateBooking } from "@/components/Modals/CreateNewBooking";
import NoDataRedirectComponent from "@/components/NoDataRedirectComponent";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  BOOKING_TYPE_OPTIONS,
  COLOR_GRADIENT_DARK,
  COLOR_GRADIENT_LIGHT,
  COLOR_LIGHT_SILVER,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import {
  PropertyTypePayload,
  useGetPropertyTypeByStructure,
} from "@/services/propertyTypes";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import { StructurePayload, useGetStructures } from "@/services/structure";
import { darkenColor } from "@/utils/darkenColor";
import { getBackgroundColor } from "@/utils/helper";
import SharedBreadCrumb from "@/utils/sharedBreadCrumb";
import { useEffect, useState } from "react";
import { TbCalendarPlus } from "react-icons/tb";

const FrontDeskLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStructureId, setSelectedStructureId] = useState<
    number | undefined
  >(0);
  const [selectedPropertyTypeId, setSelectedPropertyTypeId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  //get all structures
  const getAllStructures = useGetStructures();

  //all rooms in selected structure
  const getAllRooms = useGetAllRooms();
  const allRoomsInSelectedStructure = getAllRooms.data?.filter(
    (room: PropertyPayload) => room.structure === Number(selectedStructureId),
  );

  //get propertyType by structureId
  const getPropertyTypesByStructure = useGetPropertyTypeByStructure(
    Number(selectedStructureId),
  );

  //Set first option as default
  useEffect(() => {
    if (getAllStructures.data?.length && !selectedStructureId) {
      setSelectedStructureId(getAllStructures.data[0].id);
    }
  }, [getAllStructures.data, selectedStructureId]);

  useEffect(() => {
    if (selectedStructureId) {
      setSelectedPropertyTypeId(0);
    }
  }, [selectedStructureId]);

  return (
    <>
      <div
        className="lg:py-5 px-5 pb-5 min-h-screen overflow-visible"
        style={{
          background: `linear-gradient(to bottom, ${COLOR_GRADIENT_LIGHT}, ${COLOR_GRADIENT_DARK})`,
        }}
      >
        {getAllStructures.isLoading ? (
          <div className="flex justify-center items-center h-[80vh]">
            <p>Loading...</p>
          </div>
        ) : selectedStructureId ? (
          <>
            <div className="parent pb-40 overflow-visible">
              <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-4">
                <SharedBreadCrumb padding="px-0 pt-3" />

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-4">
                  {/* Select */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select
                      value={String(selectedStructureId)}
                      onValueChange={(value) =>
                        setSelectedStructureId(Number(value))
                      }
                    >
                      <SelectTrigger className="bg-white capitalize text-[16px] sm:text-[18px] border-gray-300 font-medium py-2 px-3 hover:cursor-pointer w-full sm:w-[250px]">
                        <SelectValue placeholder="Select Structure" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {getAllStructures.data?.map(
                          (structure: StructurePayload) => (
                            <SelectItem
                              key={structure.id}
                              value={String(structure.id)}
                              className="cursor-pointer data-[highlighted]:bg-gray-100"
                            >
                              <span className="capitalize">
                                {structure.name}
                              </span>
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* buttons */}
                  <div className="flex flex-col md:flex-row lg:items-center w-full md:w-auto gap-3">
                    <div className="booking-buttons flex overflow-x-auto space-x-2 pb-2 lg:pb-0 scrollbar-hide">
                      {BOOKING_TYPE_OPTIONS.map((type, ind) => {
                        const baseColor = getBackgroundColor(
                          type.label.toLowerCase(),
                        );
                        const bgColor =
                          hoveredIndex === ind
                            ? darkenColor(baseColor, 20)
                            : baseColor;

                        return (
                          <Button
                            key={ind}
                            onMouseEnter={() => setHoveredIndex(ind)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() =>
                              setSelectedType((prev) =>
                                prev === type.label.toLowerCase()
                                  ? null
                                  : type.label.toLowerCase(),
                              )
                            }
                            style={{
                              backgroundColor: bgColor,
                              fontSize: "14px",
                              transition: "background-color 200ms ease-in-out",
                            }}
                            className="hover:cursor-pointer md:w-56 lg:w-fit py-[8px] px-[16px] rounded-md text-white font-medium whitespace-nowrap"
                          >
                            {type.label}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Create Booking button */}
                    <div className="createBtn w-full sm:w-auto">
                      <Button
                        className="btn w-full sm:w-auto flex items-center justify-center gap-2 font-medium
                        text-sm sm:text-[14px] md:text-[15px] hover:cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <TbCalendarPlus className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                        <span className="truncate">Create Booking</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Tabs */}
                <div className="count-btns w-full">
                  <Tabs
                    value={String(selectedPropertyTypeId)}
                    onValueChange={(val) =>
                      setSelectedPropertyTypeId(Number(val))
                    }
                  >
                    <div className="overflow-x-auto scrollbar-hidden">
                      <TabsList className="flex w-max bg-gray-100">
                        <TabsTrigger value="0" className="whitespace-nowrap">
                          All Properties (
                          {allRoomsInSelectedStructure?.length || 0})
                        </TabsTrigger>
                        {getPropertyTypesByStructure.data?.map(
                          (propertyType: PropertyTypePayload) => {
                            const roomsCount = getAllRooms.data
                              ? getAllRooms.data.filter(
                                (room: PropertyPayload) =>
                                  room.property_type === propertyType.id,
                              ).length
                              : 0;

                            return (
                              <TabsTrigger
                                key={propertyType.id}
                                value={String(propertyType.id)}
                                className="whitespace-nowrap"
                              >
                                {propertyType.name} ({roomsCount})
                              </TabsTrigger>
                            );
                          },
                        )}
                      </TabsList>
                    </div>
                  </Tabs>
                </div>

                {/* Input */}
                <div className="w-full md:w-auto">
                  <Input
                    className="bg-white w-full md:w-[300px] rounded-md px-3 py-2"
                    style={{ borderColor: COLOR_LIGHT_SILVER }}
                    placeholder="Search by room..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <FrontDesk
                selectedStructureId={selectedStructureId}
                selectedPropertyTypeId={selectedPropertyTypeId}
                searchTerm={searchTerm}
                selectedType={selectedType}
              />
            </div>
          </>
        ) : (
          <NoDataRedirectComponent
            heading="No Rooms data found"
            description="Get started by creating your first structure"
            route={ROUTES.STRUCTURES}
          />
        )}
      </div>
      <CreateBooking open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

export default FrontDeskLayout;
