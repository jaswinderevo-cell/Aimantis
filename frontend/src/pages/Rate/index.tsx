import { BulkChangePrice } from "@/components/Modals/BulkChangePrice";
import ChannelSettingsModal from "@/components/Modals/ChannelSettings";
import NoDataRedirectComponent from "@/components/NoDataRedirectComponent";
import Rates from "@/components/Rates";
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
import SharedBreadCrumb from "@/utils/sharedBreadCrumb";
import { useEffect, useState } from "react";
import { TbListCheck, TbSettings } from "react-icons/tb";

const RateComponent = () => {
  const [isBulkChangePriceOpen, setIsBulkChangePriceOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPropertyTypeId, setSelectedPropertyTypeId] =
    useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStructureId, setSelectedStructureId] = useState<number>(0);

  //get all properties/rooms
  const getAllRooms = useGetAllRooms();

  //get all structures
  const getAllStructures = useGetStructures();

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

  const allRoomsInSelectedStructure = getAllRooms.data?.filter(
    (room: PropertyPayload) => room.structure === Number(selectedStructureId),
  );

  return (
    <div
      className="lg:py-5 px-5 pb-5 min-h-screen overflow-visible"
      style={{
        background: `linear-gradient(to bottom, ${COLOR_GRADIENT_LIGHT}, ${COLOR_GRADIENT_DARK})`,
      }}
    >
      <style>
        {`
        @media (max-width:1250px){
          .calendar-wrapper .property-label-wrapper{
            overflow:hidden;
          }

          .calendar-wrapper .nights-container{
            width:100%;
          }

          .calendar-wrapper .nights-input{
            width:100%;
          }

          .calendar-wrapper .nights-container input{
          width:100%;
          }

          .calendar-wrapper .dates-l-arrow{
          max-width:148px;
          width:100%;
          }

          .calendar-wrapper .property-label{
            max-width:148px;
            width:100%;
          }
        }

        @media (max-width:768px){
          .calendar-wrapper .property-label-wrapper{
            max-width:50px;
            width:100%!important;
            min-width:unset!important;
          }

          .calendar-wrapper .dates-container{
            max-width: 50px;
            width: 100%!important;
            min-width: unset!important;
          }
        }

        @media(max-width:767px){
            .calendar-wrapper .nights-wrapper{
            // justify-content:space-evenly;
            min-width:unset!important
          }
        }

        @media (max-width:668px){
          .calendar-wrapper .dates-l-arrow{
            max-width:100px
          }

          .calendar-wrapper .property-label{
            max-width:100px;
          }
        }

        @media (max-width:568px){
          .calendar-wrapper .property-label{
            max-width:80px;
          }

          .calendar-wrapper .dates-l-arrow{
            max-width:80px;
          }
        }

        @media(max-width:468px){
          .calendar-wrapper .property-label{
            max-width:60px;
          }

          .calendar-wrapper .dates-l-arrow{
            max-width:60px;
          }
        }
        `}
      </style>

      <div>
        {getAllStructures.isLoading ? (
          <div className="flex justify-center items-center h-[80vh]">
            <p>Loading...</p>
          </div>
        ) : selectedStructureId ? (
          <>
            <div className="wrapper">
              <SharedBreadCrumb padding="px-0" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4 lg:mt-0">
                {/* Select */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select
                    value={String(selectedStructureId)}
                    onValueChange={(value) =>
                      setSelectedStructureId(Number(value))
                    }
                  >
                    <SelectTrigger className="bg-white border border-gray-300 capitalize text-[16px] sm:text-[18px]font-medium px-3 hover:cursor-pointer w-full sm:w-[250px]">
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
                            <span className="capitalize">{structure.name}</span>
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Button */}
                <div className="buttons flex flex-col w-full md:w-auto md:flex-row gap-3">
                  <Button
                    type="button"
                    onClick={() => setIsBulkChangePriceOpen(true)}
                    className="btn w-full sm:w-auto md:w-52 lg:w-auto"
                  >
                    <TbListCheck style={{ width: "24px", height: "24px" }} />{" "}
                    Bulk Change prices
                  </Button>
                  <Button
                    onClick={() => setIsOpen(true)}
                    className="btn w-full sm:w-auto md:w-52 lg:w-auto"
                  >
                    <TbSettings style={{ width: "24px", height: "24px" }} />{" "}
                    Channel settings
                  </Button>
                </div>
              </div>
              {/* tabs and search */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="my-6 flex flex-col items-start lg:flex-row pb-1 lg:justify-between lg:items-center">
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
                <Input
                  className="bg-white w-full md:w-[300px] rounded-md px-3 py-2"
                  style={{ borderColor: COLOR_LIGHT_SILVER }}
                  placeholder="Search by room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="bg-white py-5 sm:mt-0 mt-8">
                <Rates
                  selectedPropertyTypeId={selectedPropertyTypeId}
                  searchTerm={searchTerm}
                  selectedStructureId={selectedStructureId}
                />
              </div>
              <BulkChangePrice
                open={isBulkChangePriceOpen}
                onOpenChange={setIsBulkChangePriceOpen}
                selectedStructureId={selectedStructureId}
              />
              <ChannelSettingsModal
                selectedStructureId={selectedStructureId}
                open={isOpen}
                onOpenChange={setIsOpen}
              />
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
    </div>
  );
};

export default RateComponent;
