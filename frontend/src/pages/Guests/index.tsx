import { BookingsDataTable } from "@/components/BookingsTable";
import { CreateBooking } from "@/components/Modals/CreateNewBooking";
import NoDataRedirectComponent from "@/components/NoDataRedirectComponent";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GRAY,
  COLOR_LIGHT_SILVER,
  COLOR_VIOLET,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { BookingPayload, useGetBookings } from "@/services/bookings";
import {
  PropertyTypePayload,
  useGetPropertyTypeByStructure,
} from "@/services/propertyTypes";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import { StructurePayload, useGetStructures } from "@/services/structure";
import SharedBreadCrumb from "@/utils/sharedBreadCrumb";
import { useEffect, useState } from "react";
import { TbCalendarPlus, TbListCheck } from "react-icons/tb";

const BookingsAndCheckins = () => {
  //get all rooms
  const getAllRooms = useGetAllRooms();
  const roomsData = getAllRooms?.data || [];

  const [selectedStructureId, setSelectedStructureId] = useState<
    number | undefined
  >(0);
  const [selectedPropertyTypeId, setSelectedPropertyTypeId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"upcoming" | "all">(
    "upcoming",
  );
  const [upcomingCount, setUpcomingCount] = useState(0);
  const getAllStructures = useGetStructures();

  //get propertyType by structureId
  const getPropertyTypesByStructure = useGetPropertyTypeByStructure(
    Number(selectedStructureId),
  );

  //all rooms in selected structure
  const allRoomsInSelectedStructure = roomsData?.filter(
    (room: PropertyPayload) => room.structure === Number(selectedStructureId),
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
    <div
      className="wrapper w-full min-h-screen"
      style={{ backgroundColor: COLOR_LIGHT_BLUE }}
    >
      {getAllStructures.isLoading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <p>Loading...</p>
        </div>
      ) : selectedStructureId ? (
        <>
          <div className="parent">
            <SharedBreadCrumb />
            <div className="p-5">
              <div className="flex justify-between flex-col md:flex-row">
                {/* select and tabs */}
                <div className="flex flex-col">
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
                  <div className="my-6 flex flex-col gap-3 md:flex-row lg:items-center lg:justify-between">
                    {/* tabs */}
                    <div className="count-btns w-full">
                      <Tabs
                        value={String(selectedPropertyTypeId)}
                        onValueChange={(val) =>
                          setSelectedPropertyTypeId(Number(val))
                        }
                      >
                        <div className="overflow-x-auto scrollbar-hidden">
                          <TabsList className="flex w-max bg-gray-100">
                            <TabsTrigger
                              value="0"
                              className="whitespace-nowrap"
                            >
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
                  </div>
                </div>

                {/* buttons */}
                <div className="flex flex-col md:flex-row gap-2 mb-5">
                  {/* authorities button */}
                  <div>
                    <Button
                      type="button"
                      className="btn w-full md:flex sm:w-auto lg:w-auto"
                    >
                      <TbListCheck style={{ width: "24px", height: "24px" }} />{" "}
                      Send to Authorities
                    </Button>
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
              <div className="w-full bg-white px-3">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between xl:flex-row xl:items-center xl:justify-between pt-8">
                  <div
                    className="flex gap-8 border-b md:justify-start overflow-x-auto lg:pb-0 scrollbar-hide"
                    style={{ borderColor: COLOR_LIGHT_GRAY }}
                  >
                    <button
                      onClick={() => setActiveFilter("upcoming")}
                      className={`border-b font-medium px-4 text-sm w-full sm:w-auto`}
                      style={{
                        borderColor:
                          activeFilter === "upcoming"
                            ? COLOR_VIOLET
                            : COLOR_LIGHT_SILVER,
                        color:
                          activeFilter === "upcoming"
                            ? COLOR_VIOLET
                            : COLOR_LIGHT_GRAY,
                      }}
                    >
                      Upcoming checkins ({upcomingCount})
                    </button>

                    <button
                      onClick={() => setActiveFilter("all")}
                      className={`px-4 text-sm w-full sm:w-auto font-medium border-b`}
                      style={{
                        borderColor:
                          activeFilter === "all"
                            ? COLOR_VIOLET
                            : COLOR_LIGHT_SILVER,
                        color:
                          activeFilter === "all"
                            ? COLOR_VIOLET
                            : COLOR_LIGHT_GRAY,
                      }}
                    >
                      All checkins
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <BookingsDataTable
                    selectedStructureId={selectedStructureId}
                    selectedPropertyTypeId={selectedPropertyTypeId}
                    activeFilter={activeFilter}
                    onUpcomingCountChange={setUpcomingCount}
                  />
                </div>
              </div>
            </div>
          </div>
          <CreateBooking open={isModalOpen} onOpenChange={setIsModalOpen} />
        </>
      ) : (
        <NoDataRedirectComponent
          heading="No Rooms data found"
          description="Get started by creating your first structure"
          route={ROUTES.STRUCTURES}
        />
      )}
    </div>
  );
};

export default BookingsAndCheckins;
