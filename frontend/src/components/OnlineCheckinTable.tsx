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
  CheckinTemplate,
  useDeleteCheckinTemplate,
  useGetCheckinTemplates,
} from "@/services/onlineCheckinForm";
import { ArrowUpDown } from "lucide-react";
import DeleteConfirmModal from "./Modals/ConfirmDelete";
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
import UpdateCustomCheckinTemplate from "./Modals/EditDetailModals/EditCustomCheckinTemplate";
import { CheckinTemplatePopover } from "./Modals/CheckinTemplatePopover";

export function OnlineCheckinTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ actions: true });
  const [rowSelection, setRowSelection] = React.useState({});
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    React.useState(false);
  const [deletedRowId, setDeletedRowId] = React.useState<number | null>(null);

  //get checkin tamplates
  const getCheckinTemplates = useGetCheckinTemplates();
  const checkinTemplatesData = getCheckinTemplates?.data || [];

  //delete checkin template
  const deleteCheckinTemplateMutation = useDeleteCheckinTemplate();

  const handleConfirmDeleteOpen = (rowId: number) => {
    setDeletedRowId(rowId);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletedRowId !== null) {
      deleteCheckinTemplateMutation.mutate(deletedRowId);
      setIsConfirmDeleteModalOpen(false);
      setDeletedRowId(null);
    }
  };
  const handleCancelDelete = () => {
    setIsConfirmDeleteModalOpen(false);
    setDeletedRowId(null);
  };

  const handleEditClick = (id:number) => {
    setEditingId(id);
    setOpenEditModal(true);
  };

  React.useEffect(() => {
    if (editingId !== null) {
      setOpenEditModal(true);
    }
  }, [editingId]);

  const columns: ColumnDef<CheckinTemplate>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 font-semibold text-[14px]"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Check in form
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
      accessorKey: "structures",
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
      cell: ({ row }) => {
        const structures = row.original.structures;
        return (
          <div className="mx-4 text-[14px] text-black">
            {structures?.length
              ? structures.map(s => s.name).join(", ")
              : "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const template = row.original;
        return (
          <>
            <CheckinTemplatePopover
              id={template.id}
              handleEditClick={() => handleEditClick(template.id)}
              handleConfirmDeleteOpen={handleConfirmDeleteOpen}
              portalName={""}
            />
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: checkinTemplatesData,
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

        <DeleteConfirmModal
          open={isConfirmDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
        <UpdateCustomCheckinTemplate
          open={openEditModal}
          onOpenChange={setOpenEditModal}
          editingTemplateId={editingId}
        />
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 me-2">
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
