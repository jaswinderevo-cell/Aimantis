"use client";
import { PropertiesTable } from "@/components/PropertiesTable";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { COLOR_LIGHT_BLUE, COLOR_LIGHT_SILVER } from "@/constants/constants";
import {
  PropertyTypePayload,
  useGetPropertyTypeByStructure,
} from "@/services/propertyTypes";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import { StructurePayload, useGetStructures } from "@/services/structure";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { AddPropertylModal } from "../../components/Modals/AddPropertyModal";
import SharedBreadCrumb from "@/utils/sharedBreadCrumb";
import NoDataRedirectComponent from "@/components/NoDataRedirectComponent";
import { ROUTES } from "@/constants/routes";

const Properties = () => {
  const [selectedStructureId, setSelectedStructureId] = useState< string | undefined >("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyTypeId, setSelectedPropertyTypeId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");

  //get all properties/rooms
  const getAllRooms = useGetAllRooms();

  //get all structures
  const getAllStructures = useGetStructures();

  //get propertyType by structureId
  const getPropertyTypesByStructure = useGetPropertyTypeByStructure(Number(selectedStructureId));

  //Set first option as default
  useEffect(() => {
    if (getAllStructures.data?.length && !selectedStructureId) {
      setSelectedStructureId(String(getAllStructures.data[0].id));
    }
  }, [getAllStructures.data, selectedStructureId]);

  useEffect(() => {
    if (selectedStructureId) {
      setSelectedPropertyTypeId(0);
    }
  }, [selectedStructureId]);

  const allRoomsInSelectedStructure = getAllRooms.data?.filter(
    (room: PropertyPayload) => room.structure === Number(selectedStructureId),
  );

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
          <div className="wrapper">
            <SharedBreadCrumb />
            <div className="p-5">
              <div className="flex justify-between items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white"
                    style={{ borderColor: COLOR_LIGHT_SILVER }}
                  />
                </div>
              </div>

              <div className="bg-white mt-10 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Select */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Select
                      value={selectedStructureId}
                      onValueChange={(value) => setSelectedStructureId(value)}
                    >
                      <SelectTrigger className="capitalize text-[16px] sm:text-[18px] border-none font-medium py-2 px-3 hover:cursor-pointer w-full sm:w-[250px]">
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

                  {/* Button */}
                  <button
                    className="btn-secondary rounded-md px-3 py-2 font-medium flex items-center justify-center gap-2 hover:cursor-pointer text-[14px] w-full sm:w-auto"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FaPlus className="inline" size={15} />
                    Add Property
                  </button>
                </div>
                {/* tabs */}
                <div className="my-6 flex flex-col items-start lg:flex-row border-b pb-1 lg:justify-between lg:items-center px-1">
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
                </div>

                <AddPropertylModal
                  open={isModalOpen}
                  onOpenChange={setIsModalOpen}
                  selectedPropertyTypeId={selectedPropertyTypeId}
                  selectedStructureId={Number(selectedStructureId)}
                  getPropertyTypesByStructure={getPropertyTypesByStructure}
                />
                <div className="overflow-x-auto">
                  <PropertiesTable
                    selectedPropertyTypeId={selectedPropertyTypeId}
                    selectedStructureId={Number(selectedStructureId)}
                    searchTerm={searchTerm}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <NoDataRedirectComponent
          heading="No data found"
          description="Get started by creating your first structure"
          route={ROUTES.STRUCTURES}
        />
      )}
    </div>
  );
};

export default Properties;
