"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { COLOR_LIGHT_BLUE, COLOR_LIGHT_GRAY } from "@/constants/constants";
import {
  PropertyPayload,
  useDeleteRoom,
  useGetAllRooms,
} from "@/services/rooms";
import { ArrowUpDown } from "lucide-react";
import DeleteConfirmModal from "./Modals/ConfirmDelete";
import { EditPropertyDetailModal } from "./Modals/EditDetailModals/EditPropertiesDetails";
import { TablePopoverForEditModalData } from "./Modals/PopoverForEditModalData";
import { Button } from "./ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}

interface PropertiesTableProps {
  selectedPropertyTypeId: number;
  selectedStructureId: number;
  searchTerm: string;
}

export function PropertiesTable({
  selectedPropertyTypeId,
  selectedStructureId,
  searchTerm,
}: PropertiesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({ actions: true });
  const [rowSelection, setRowSelection] = React.useState({});
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingProperty, setEditingProperty] = React.useState<PropertyPayload | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = React.useState(false);
  const [deletedRowId, setDeletedRowId] = React.useState<number | null>(null);

  //get all rooms
  const getAllRooms = useGetAllRooms();

  //delete room data
  const deleteRoomMutation = useDeleteRoom();

  //Filter rooms based on selectedPropertyTypeId and selectedStructureId
  const filteredRooms = React.useMemo(() => {
    if (!getAllRooms.data) return [];

    let rooms = getAllRooms?.data;

    // Filter by selectedPropertyTypeId
    if (selectedPropertyTypeId !== 0) {
      rooms = rooms.filter(
        (item: PropertyPayload) => item.property_type === selectedPropertyTypeId,
      );
    }

    //Filter by selectedStructureId
    if (selectedStructureId) {
      rooms = rooms.filter(
        (item: PropertyPayload) => item.structure === selectedStructureId,
      );
    }

    //search filter
    if (searchTerm) {
      rooms = rooms.filter((item: PropertyPayload) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return rooms;
  }, [
    getAllRooms.data,
    selectedPropertyTypeId,
    selectedStructureId,
    searchTerm,
  ]);

  const handleConfirmDeleteOpen = (rowId: number) => {
    setDeletedRowId(rowId);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletedRowId !== null) {
      deleteRoomMutation.mutate(deletedRowId);
      setIsConfirmDeleteModalOpen(false);
      setDeletedRowId(null);
    }
  };
  const handleCancelDelete = () => {
    setIsConfirmDeleteModalOpen(false);
    setDeletedRowId(null);
  };

  const handleEditClick = (property: PropertyPayload) => {
    setEditingProperty(property);
    setOpenEditModal(true);
  };
  React.useEffect(() => {
    if (editingId !== null) {
      setOpenEditModal(true);
    }
  }, [editingId]);

  const columns: ColumnDef<PropertyPayload>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 font-semibold text-[14px]"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Property Name
            </div>
            <ArrowUpDown
              className="hover:cursor-pointer"
              size={14}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              style={{ color: COLOR_LIGHT_GRAY, strokeWidth: "2.8px" }}
            />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize mx-4 text-[14px] text-black">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "floor_number",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 text-[14px] font-semibold"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Floor Number
            </div>
            <ArrowUpDown
              className="hover:cursor-pointer"
              size={14}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              style={{ color: COLOR_LIGHT_GRAY, strokeWidth: "2.8px" }}
            />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize mx-4 text-[14px] text-black">
          {row.getValue("floor_number")}
        </div>
      ),
    },
    {
      accessorKey: "property_type_name",
      header: ({ column }) => {
        return (
          <div className="flex items center justify-between">
            <div
              className="mx-4 text-[14px] font-semibold"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Property Type
            </div>
            <ArrowUpDown
              className="hover:cursor-pointer"
              size={14}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              style={{ color: COLOR_LIGHT_GRAY, strokeWidth: "2.8px" }}
            />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize mx-4 text-[14px] text-black">
          {row.getValue("property_type_name")}
        </div>
      ),
    },
    {
      accessorKey: "amenities",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 text-[14px] font-semibold"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Room Extra Amenities
            </div>

            <ArrowUpDown
              className="hover:cursor-pointer"
              size={14}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              style={{ color: COLOR_LIGHT_GRAY, strokeWidth: "2.8px" }}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const amenities: string[] = row.getValue("amenities") || [];
        return (
          <div className="capitalize mx-4 text-[14px] text-black">
            {amenities}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 text-[14px] font-semibold"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Status
            </div>
            <ArrowUpDown
              className="hover:cursor-pointer"
              size={14}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              style={{ color: COLOR_LIGHT_GRAY, strokeWidth: "2.8px" }}
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColor =
          Number(status) == 1
            ? "text-green-400 bg-green-100"
            : "text-blue-400 bg-blue-100";

        return (
          <div
            className={`capitalize mx-3 py-1 text-center rounded-full ${statusColor}`}
          >
            {Number(status) == 1 ? "Mapped" : "Unmapped"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const property = row.original;
        return (
          <div className="flex justify-center">
            <TablePopoverForEditModalData
              handleEditClick={handleEditClick}
              property={property}
              handleConfirmDeleteOpen={handleConfirmDeleteOpen}
            />
          </div>
        );
      },
      meta: {
        className: "sticky right-0 bg-white z-20",
      },
    },
  ];

  const table = useReactTable({
    data: filteredRooms,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 7,
      },
    },
  });

  return (
    <div className="w-full">
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} style={{ border: "none" }}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.columnDef.meta?.className}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? COLOR_LIGHT_BLUE : "",
                    border: "none",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell, cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <EditPropertyDetailModal
          open={openEditModal}
          onOpenChange={(open) => {
            setOpenEditModal(open);
            if (!open) {
              setEditingId(null);
            }
          }}
          editingProperty={editingProperty}
        />
        <DeleteConfirmModal
          open={isConfirmDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
