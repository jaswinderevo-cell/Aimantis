"use client";
import { AddPropertyTypeModal } from "@/components/Modals/AddPropertyTypeModal";
import DeleteConfirmModal from "@/components/Modals/ConfirmDelete";
import { EditPropertyTypeModal } from "@/components/Modals/EditDetailModals/EditPropertyTypesDetails";
import NoDataRedirectComponent from "@/components/NoDataRedirectComponent";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  COLOR_GRADIENT_LIGHT,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_SILVER,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import {
  PropertyTypePayload,
  useDeletePropertyType,
  useGetPropertyType,
  useGetPropertyTypeByStructure,
} from "@/services/propertyTypes";
import {
  StructurePayload,
  useGetStructureById,
  useGetStructures,
} from "@/services/structure";
import SharedBreadCrumb from "@/utils/sharedBreadCrumb";
import SkeletonLoader from "@/utils/skeletonLoader";
import {
  ArrowLeft,
  Bed,
  Edit,
  Search,
  Square,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";

export default function PropertyTypesManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPropertyType, setEditingPropertyType] =
    useState<PropertyTypePayload | null>(null);
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [deletedPopertyTypeId, setDeletedPropertyTypeId] = useState<number | null>(null);
  const { structureId } = useParams();
  const structureIdNum = Number(structureId);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStructureId, setSelectedStructureId] = useState<
    number | undefined
  >(0);

  //get all property types
  const getAllPropertyTypes = useGetPropertyType();

  //get property types by structure
  const getPropertyTypesByStructure =
    useGetPropertyTypeByStructure(structureIdNum);

  //delete property type
  const deletePropertyTypeMutation = useDeletePropertyType();

  //get structure by id
  const getStructureById = useGetStructureById(structureIdNum);

  //getAllStructures
  const getAllStructures = useGetStructures();

  const propertyTypes = structureId
    ? getPropertyTypesByStructure.data
    : getAllPropertyTypes.data;

  const handleConfirmDeleteOpen = (id: number) => {
    setDeletedPropertyTypeId(id);
    setIsDeleteConfirmModal(true);
  };

  const handleDelete = (id: number) => {
    deletePropertyTypeMutation.mutate(id);
  };

  const getOccupancyColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 20) return "text-yellow-600";
    return "text-red-600";
  };

  //filter
  const filteredPropertyTypes = useMemo(() => {
    if (!propertyTypes) return [];

    return propertyTypes.filter((propertyType: PropertyTypePayload) => {
      const matchesSearch = propertyType.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStructure =
        !selectedStructureId || String(selectedStructureId) === "0"
          ? true
          : propertyType.structure === Number(selectedStructureId);

      return matchesSearch && matchesStructure;
    });
  }, [propertyTypes, searchTerm, selectedStructureId]);

  //skeletonCount
  const skeletonCount = filteredPropertyTypes?.length || 4;

  if (
    !getAllStructures.isLoading &&
    (!getAllStructures.data || getAllStructures.data.length === 0)
  ) {
    return (
      <div
        className="p-5 min-h-screen"
        style={{ backgroundColor: COLOR_GRADIENT_LIGHT }}
      >
        <NoDataRedirectComponent
          heading="No structures found"
          description="Get started by creating your first structure"
          buttonText="Go to Structure"
          route={ROUTES.STRUCTURES}
        />
      </div>
    );
  }

  return (
    <div
      className={`px-5 pb-5 min-h-screen`}
      style={{ backgroundColor: COLOR_LIGHT_BLUE }}
    >
      {!structureId && <SharedBreadCrumb padding="pt-4" />}
      <div className="space-y-6 lg:pt-5 pt-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* back to structure button */}
          {structureId && (
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="order-1 md:order-2">
                <h1 className="text-xl md:text-2xl font-bold text-black">
                  Property Types
                </h1>
                <p className="capitalize text-gray-600 text-sm md:text-base">
                  {getStructureById.data?.name}
                </p>
              </div>
              <Link to={"/portal/properties/structures"} className="p-0">
                <Button
                  variant="ghost"
                  className="flex items-center text-gray-500 hover:text-gray-800 gap-2 w-full md:w-auto justify-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Structures
                </Button>
              </Link>
            </div>
          )}

          <div
            className={`flex flex-col md:flex-row gap-3 md:gap-5 ${structureId ? "lg:justify-end" : "lg:justify-between"}  w-full lg:flex-1`}
          >
            {/* search bar */}
            <div className="flex flex-col lg:justify-between lg:flex-row gap-4 w-full">
              <div className="flex flex-col md:flex-row lg:flex-row gap-4 w-full lg:w-auto">
                {!structureId && (
                  <div className="flex items-center gap-2 w-full lg:w-auto">
                    <Select
                      value={String(selectedStructureId)}
                      onValueChange={(value) =>
                        setSelectedStructureId(Number(value))
                      }
                    >
                      <SelectTrigger
                        className="capitalize text-[16px] border font-medium py-1 pe-4 hover:cursor-pointer w-full lg:w-[250px] bg-white"
                        style={{ borderColor: COLOR_LIGHT_SILVER }}
                      >
                        <SelectValue placeholder="Select Structure" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem
                          className="cursor-pointer data-[highlighted]:bg-gray-100"
                          value="0"
                        >
                          All
                        </SelectItem>
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
                )}

                <div className="relative w-full lg:max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                  <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white w-full"
                    style={{ borderColor: COLOR_LIGHT_SILVER }}
                  />
                </div>
              </div>

              {/* Button */}
              <div className="w-full lg:w-fit">
                <button
                  className="btn text-[15px] flex justify-center font-medium items-center gap-2 text-white rounded-md py-2 px-4 lg:w-auto w-full md:w-fit"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FaPlus size={16} /> Add Property Type
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Property Types Grid */}
        {getPropertyTypesByStructure.isLoading ||
        getAllPropertyTypes.isLoading ? (
            <div className="grid mt-10 gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(skeletonCount)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : filteredPropertyTypes && filteredPropertyTypes.length > 0 ? (
            <div className="grid mt-10 gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPropertyTypes.map((propertyType: PropertyTypePayload) => (
                <Card
                  key={propertyType.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow pt-0 w-full"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={
                        propertyType.image_url ||
                      "/placeholder.svg?height=200&width=300&query=property room"
                      }
                      alt={propertyType.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {propertyType.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">Description</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">€100</p>
                        <p className="text-xs text-gray-600">per night</p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Content */}
                  <CardContent className="pt-0">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <Bed className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">
                          {propertyType.num_bedrooms}
                        </p>
                        <p className="text-xs text-gray-600">Bedrooms</p>
                      </div>
                      <div className="text-center">
                        <Users className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">
                          {propertyType.max_guests}
                        </p>
                        <p className="text-xs text-gray-600">Max Guests</p>
                      </div>
                      <div className="text-center">
                        <Square className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">
                          {propertyType.property_size_sqm}
                        </p>
                        <p className="text-xs text-gray-600">sq ft</p>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="mb-4">
                      <p className="text-sm font-medium">Availability</p>
                      <p className={`text-sm ${getOccupancyColor(3, 5)}`}>
                        {3} of {5} rooms available
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-[14px] bg-transparent text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setEditingPropertyType(propertyType);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                      Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-gray-100 bg-transparent"
                        onClick={() => {
                          handleConfirmDeleteOpen(propertyType.id as number);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
              No property types yet
              </h3>
              <p className="text-gray-600 mb-4">
              Create your first property type to start organizing your units
              </p>
              <div className="flex justify-center items-center">
                <button
                  className="btn text-[15px] flex justify-between font-medium items-center gap-2 text-white text-center rounded-md py-2 hover:cursor-pointer px-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FaPlus size={16} /> Add Property Type
                </button>
              </div>
            </div>
          )}

        <AddPropertyTypeModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={() => {
            setIsModalOpen(false);
          }}
          getStructureById={getStructureById}
        />

        <EditPropertyTypeModal
          open={isEditModalOpen}
          onOpenChange={(isOpen) => {
            setIsEditModalOpen(isOpen);
            if (!isOpen) setEditingPropertyType(null);
          }}
          property={editingPropertyType}
        />
        <DeleteConfirmModal
          open={isDeleteConfirmModal}
          onCancel={() => setIsDeleteConfirmModal(false)}
          onConfirm={() => {
            if (deletedPopertyTypeId) {
              handleDelete(deletedPopertyTypeId);
              setIsDeleteConfirmModal(false);
              setDeletedPropertyTypeId(null);
            }
          }}
          confirmLoading={deletePropertyTypeMutation.isPending}
        />
      </div>
    </div>
  );
}
