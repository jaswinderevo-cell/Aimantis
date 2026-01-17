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

import { Button } from "@/components/ui/Button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { COLOR_LIGHT_BLUE, COLOR_LIGHT_GRAY } from "@/constants/constants";
import rawData from "@/lib/portalsTableData.json";
import { PortalsData } from "@/utils/dataFormatter";
import { ArrowUpDown } from "lucide-react";
import DeleteConfirmModal from "./Modals/ConfirmDelete";
import { PortalPopover } from "./Modals/PortalPopOver";
import { FaPlus } from "react-icons/fa6";

export function PortalsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const data: PortalsData[] = rawData;
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [tableData, setTableData] = React.useState<PortalsData[]>(data);
  const [rowSelection, setRowSelection] = React.useState({});

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    React.useState(false);
  const [deletedRowId, setDeletedRowId] = React.useState<number | null>(null);

  const handleConfirmDeleteOpen = (rowId: number) => {
    setDeletedRowId(rowId);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletedRowId !== null) {
      setTableData((prev) => prev.filter((row) => row.id !== deletedRowId));
      setIsConfirmDeleteModalOpen(false);
      setDeletedRowId(null);
    }
  };
  const handleCancelDelete = () => {
    setIsConfirmDeleteModalOpen(false);
    setDeletedRowId(null);
  };

  const columns: ColumnDef<PortalsData>[] = [
    {
      accessorKey: "portalName",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="font-semibold text-[14px]"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Portal Name
            </div>
            <ArrowUpDown
              className="hover:cursor-pointer text-[#667085] transition-colors duration-200 ease-in-out hover:text-gray-700"
              size={14}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              style={{ strokeWidth: "2.8px" }}
            />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize font-normal text-[14px] text-black">
          {row.getValue("portalName")}
        </div>
      ),
    },

    {
      accessorKey: "connectedDate",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 text-[15px] font-semibold"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Connected Date
            </div>
            <ArrowUpDown
              className="hover:cursor-pointer text-[#667085] transition-colors duration-200 ease-in-out hover:text-gray-700"
              size={14}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              style={{ strokeWidth: "2.8px" }}
            />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize mx-4 font-normal text-[15px] text-black">
          {row.getValue("connectedDate")
            ? row.getValue("connectedDate")
            : "Not Added"}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const portal = row.original;
        console.log("Portal", portal);
        return (
          <div className="flex justify-end">
            {row.getValue("connectedDate") ? (
              <>
                <PortalPopover
                  portalName={portal.portalName}
                  id={portal.id}
                  handleConfirmDeleteOpen={handleConfirmDeleteOpen}
                />
              </>
            ) : (
              <>
                <FaPlus
                  className="cursor-pointer text-gray-700 hover:text-gray-900"
                  size={20}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tableData,
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
                    backgroundColor:
                      index % 2 === 0 ? "white" : COLOR_LIGHT_BLUE,
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
      <DeleteConfirmModal
        open={isConfirmDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
