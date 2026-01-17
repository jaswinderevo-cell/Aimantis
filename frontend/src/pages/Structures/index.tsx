"use client";

import { AddStructureModal } from "@/components/Modals/AddStructure";
import { StructurePopover } from "@/components/Modals/StructurePopover";
import NoDataRedirectComponent from "@/components/NoDataRedirectComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  COLOR_BLUE,
  COLOR_GRADIENT_LIGHT,
  COLOR_LIGHT_SILVER,
  COLOR_VIOLET,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import structureData from "@/lib/structures.json";
import {
  PropertyTypePayload,
  useGetPropertyType,
} from "@/services/propertyTypes";
import { StructurePayload, useGetStructures } from "@/services/structure";
import {
  AllStructureUserPayload,
  StructureUsersResponse,
  useGetAllStructuresUsers,
} from "@/services/structureUsers";
import { Structure } from "@/utils/dataFormatter";
import { getStructureTypeColor } from "@/utils/helper";
import { SharedButton } from "@/utils/sharedButton";
import SkeletonLoader from "@/utils/skeletonLoader";
import {
  Bed,
  Building2,
  MapPin,
  MoreVertical,
  Search,
  Settings,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const mockStructures: Structure[] = structureData.map((item) => ({
  ...item,
  status: item.status as Structure["status"],
  type: item.type as Structure["type"],
}));

export default function StructuresDashboard() {
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [structures, setStructures] = useState<Structure[]>(mockStructures);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "hotel" | "apartment" | "mixed_use"
  >("all");

  //get all structures
  const getAllStrucutres = useGetStructures();

  const filteredStructures = getAllStrucutres.data?.filter(
    (structure: StructurePayload) => {
      const matchesSearch = structure.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" ||
        structure.structure_type.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    },
  );

  //get property types
  const getAllPropertyTypes = useGetPropertyType();
  //get structureUsers
  const structureUsers = useGetAllStructuresUsers();
  const structureUserData = structureUsers?.data || [];

  //skeletonCount
  const skeletonCount = getAllStrucutres?.data?.length || 4;

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const overViewArr = [
    {
      label: "Total Structures",
      value: getAllStrucutres?.data?.length,
      icon: Building2,
    },
    {
      label: "Total Units",
      value: structures.reduce((sum, s) => sum + s.totalUnits, 0),
      icon: Bed,
    },
    {
      label: "Average Occupancy",
      value:
        Math.round(
          structures.reduce((sum, s) => sum + s.occupancyRate, 0) /
            structures.length,
        ) + "%",
      icon: TrendingUp,
    },
    {
      label: "Total Users",
      value: structures.reduce((sum, s) => sum + s.users, 0),
      icon: Users,
    },
  ];

  const navigate = useNavigate();

  const handleViewPropertyTypes = (structureId: number) => {
    navigate(`/portal/properties/structures/${structureId}/property-types`);
  };

  const handleViewStructureUsers = (structureId: number) => {
    navigate(`/portal/properties/structures/${structureId}/structure-users`);
  };

  const handleCheckInSettingsNavigate = () => {
    navigate(ROUTES.GUEST_CONFIGURATION);
  };

  if (
    !getAllStrucutres.isLoading &&
    (!getAllStrucutres.data || getAllStrucutres.data.length === 0)
  ) {
    return (
      <div
        className="p-5 min-h-screen"
        style={{ backgroundColor: COLOR_GRADIENT_LIGHT }}
      >
        <NoDataRedirectComponent
          heading="No data found"
          description="Get started by creating your first structure"
          buttonText="Add Structure"
          icon="add"
          route={""}
        />
      </div>
    );
  }

  return (
    <div
      className="p-5 min-h-screen"
      style={{ backgroundColor: COLOR_GRADIENT_LIGHT }}
    >
      <div className="space-y-6">
        <div className="flex flex-col md:items-start md:justify-start lg:flex-row gap-5 lg:justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Property Structures
            </h1>
            <p className="text-gray-600">
              Manage your hotels, apartments, and mixed-use properties
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Button
              className="btn w-full md:w-auto flex items-center justify-center gap-2 font-medium text-[14px] hover:cursor-pointer"
              style={{
                padding: "12px 24px",
                fontSize: "15px",
              }}
              onClick={() => setIsStructureModalOpen(true)}
            >
              <FaPlus size={16} /> Add Structure
            </Button>
          </div>
        </div>
        {/* Stats Overview */}
        <div className="overflow-x-auto scr pb-2 scrollbar-hidden">
          <div className="flex gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 scrollbar-hidden">
            {overViewArr.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-4 shadow rounded-md min-w-[170px] lg:min-w-[220px] flex-shrink-0"
                >
                  <Icon
                    size={30}
                    className="mb-4"
                    style={{ color: COLOR_BLUE }}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[17px] text-black font-medium">
                      {item.label}
                    </p>
                    <p
                      className="font-semibold text-[28px] mx-2"
                      style={{ color: COLOR_VIOLET }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
              style={{ borderColor: COLOR_LIGHT_SILVER }}
            />
          </div>
          <div className="flex gap-2 flex-col md:flex-row lg:flex-row">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              className={` ${filterType === "all" ? "bg-[#2563EB]" : "bg-white"}
              ${filterType === "all" ? "text-white" : "text-black"}
              hover:bg-[#2563EB] hover:text-white`}
            >
              All
            </Button>
            <Button
              variant={filterType === "hotel" ? "default" : "outline"}
              onClick={() => setFilterType("hotel")}
              className={` ${filterType === "hotel" ? "bg-[#2563EB]" : "bg-white"}
              ${filterType === "hotel" ? "text-white" : "text-black"}
              hover:bg-[#1D4ED8] hover:text-white`}
            >
              Hotels
            </Button>
            <Button
              variant={filterType === "apartment" ? "default" : "outline"}
              onClick={() => setFilterType("apartment")}
              className={` ${filterType === "apartment" ? "bg-[#2563EB]" : "bg-white"}
              ${filterType === "apartment" ? "text-white" : "text-black"}
              hover:bg-[#1D4ED8] hover:text-white`}
            >
              Apartments
            </Button>
            <Button
              variant={filterType === "mixed_use" ? "default" : "outline"}
              onClick={() => setFilterType("mixed_use")}
              className={` ${filterType === "mixed_use" ? "bg-[#2563EB]" : "bg-white"}
              ${filterType === "mixed_use" ? "text-white" : "text-black"}
              hover:bg-[#1D4ED8] hover:text-white`}
            >
              Mixed use
            </Button>
          </div>
        </div>
      </div>

      {/* Structures Grid */}
      <div className="grid mt-10 gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {getAllStrucutres.isLoading ? (
          [...Array(skeletonCount)].map((_, i) => <SkeletonLoader key={i} />)
        ) : filteredStructures && filteredStructures.length > 0 ? (
          filteredStructures.map((structure: StructurePayload) => {
            const filteredPropertyTypes = getAllPropertyTypes?.data?.filter(
              (i: PropertyTypePayload) => i.structure === structure.id,
            );
            const structureUsers =
              structureUserData?.filter(
                (u: AllStructureUserPayload) => u.structure_id === structure.id,
              ) || [];

            return (
              <Card
                key={structure.id}
                className="overflow-hidden hover:shadow-lg pt-0 transition-shadow min-w-[260px]"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={structure?.image_url || "/placeholder.svg"}
                    alt={structure.name}
                    className="w-full h-full object-cover"
                  />
                  <StructurePopover
                    selectedStructure={structure as StructurePayload}
                  >
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/80 hover:bg-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </StructurePopover>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {structure.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        Location
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge
                        className={`lowercase ${getStructureTypeColor(
                          structure.structure_type.toLowerCase(),
                        )}`}
                      >
                        {structure.structure_type}
                      </Badge>
                      <Badge className={getStatusColor(structure.status)}>
                        {structure.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">50</p>
                      <p className="text-xs text-gray-600">Total Units</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">70%</p>
                      <p className="text-xs text-gray-600">Occupancy</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        structure Rating
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">€100/month</div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{structureUsers?.length + " " + "users"}</span>
                    <span>
                      {filteredPropertyTypes
                        ? filteredPropertyTypes.length
                        : "0"}{" "}
                      property types
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="py-1.5 flex-1 bg-transparent hover:bg-gray-100"
                      onClick={() =>
                        handleViewStructureUsers(structure.id as number)
                      }
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage structure users
                    </Button>
                    <SharedButton
                      text="View property types"
                      width="full"
                      padding="p-0"
                      onClick={() =>
                        handleViewPropertyTypes(structure.id as number)
                      }
                      height=""
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No matching structures
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter options.
            </p>
          </div>
        )}
      </div>
      <AddStructureModal
        open={isStructureModalOpen}
        onOpenChange={setIsStructureModalOpen}
      />
    </div>
  );
}
