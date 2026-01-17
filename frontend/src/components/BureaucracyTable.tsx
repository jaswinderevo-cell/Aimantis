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
} from "@/services/rooms";
import { ArrowUpDown } from "lucide-react";
import DeleteConfirmModal from "./Modals/ConfirmDelete";
import { EditPropertyDetailModal } from "./Modals/EditDetailModals/EditPropertiesDetails";
import { PortalPopover } from "./Modals/PortalPopOver";
import { Button } from "./ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";

interface CredentialData {
  name: string;
  structure: string;
}

const mockCredentials: CredentialData[] = [
  { name: "ISTAT - The Bliss", structure: "The Bliss" },
  { name: "ISTAT Tiffany Home", structure: "Tiffany Home - CIL" },
  { name: "ISTAT Pearl", structure: "Pearl Home" },
  { name: "ISTAT Name", structure: "Structure 3" },
  { name: "ISTAT Name 2", structure: "Structure 4" },
];

export function BureaucracyTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ actions: true });
  const [rowSelection, setRowSelection] = React.useState({});
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingProperty, setEditingProperty] =
    React.useState<PropertyPayload | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    React.useState(false);
  const [deletedRowId, setDeletedRowId] = React.useState<number | null>(null);


  //delete room data
  const deleteRoomMutation = useDeleteRoom();

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

  const columns: ColumnDef<CredentialData>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 font-semibold text-[14px]"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Credential Name
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
      accessorKey: "structure",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 text-[14px] font-semibold"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Structure associated
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
          {row.getValue("structure")}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        return (
          <>
            {/* // <PortalPopover
          //   id={1}
          //   handleEditClick={() => console.log("object")}
          //   handleConfirmDeleteOpen={() => console.log("object")}
          //   portalName={""}
          // /> */}
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: mockCredentials,
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
                    <TableHead key={header.id}>
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
                    backgroundColor: index % 2 !== 0 ? COLOR_LIGHT_BLUE : "",
                    border: "none",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
