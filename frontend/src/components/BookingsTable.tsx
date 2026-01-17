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

import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GRAY,
  COLOR_VIOLET,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import {
  BookingPayload,
  useDeleteBooking,
  useGetBookings,
} from "@/services/bookings";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import {
  getBackgroundColor,
  getBackgroundColorLight,
  getStatusBackground,
  getStatusTextColor,
} from "@/utils/helper";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CheckinModal from "./Modals/CheckinModal";
import DeleteConfirmModal from "./Modals/ConfirmDelete";
import { TablePopover } from "./Modals/Popover";
import { Checkbox } from "./ui/Checkbox";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}

export function BookingsDataTable({
  selectedStructureId,
  selectedPropertyTypeId,
  activeFilter,
  onUpcomingCountChange,
}: {
  activeFilter?: "upcoming" | "all";
  selectedStructureId?: number;
  selectedPropertyTypeId?: number;
  onUpcomingCountChange?: (count: number) => void;
}) {
  //get all bookings
  const getAllBookings = useGetBookings();
  const bookingsData = getAllBookings?.data || [];

  //get all rooms
  const getAllRooms = useGetAllRooms();
  const roomsData = getAllRooms?.data || [];

  //delete booking mutation
  const deleteBookingMutation = useDeleteBooking();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [checkinModalOpen, setCheckinModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingPayload | null>(
    null,
  );
  const [tableData, setTableData] = useState<BookingPayload[]>([]);

  //filter and insert room names in booking
  useEffect(() => {
    if (bookingsData.length && roomsData.length) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const fiveDaysLater = new Date(today);
      fiveDaysLater.setDate(today.getDate() + 5);

      let upcomingCount = 0;

      const filteredAndUpdated = bookingsData
        .filter((b: BookingPayload) => {
          const checkinDate = new Date(b.check_in_date);

          // filter conditions
          const matchStructure =
            !selectedStructureId || selectedStructureId === 0
              ? true
              : b.structure === selectedStructureId;

          const matchPropertyType =
            !selectedPropertyTypeId || selectedPropertyTypeId === 0
              ? true
              : b.property_type === selectedPropertyTypeId;

          const isInUpcoming =
            checkinDate >= today && checkinDate <= fiveDaysLater;

          if (matchStructure && matchPropertyType && isInUpcoming) {
            upcomingCount++;
          }

          const matchActiveFilter =
            activeFilter === "upcoming" ? isInUpcoming : true;

          return matchStructure && matchPropertyType && matchActiveFilter;
        })
        .map((booking: BookingPayload) => {
          const room = roomsData.find(
            (r: PropertyPayload) => r.id === booking.property,
          );
          return {
            ...booking,
            propertyName: room?.name || "Unknown",
          };
        });

      setTableData(filteredAndUpdated);
      onUpcomingCountChange?.(upcomingCount);
    } else {
      setTableData([]);
      onUpcomingCountChange?.(0);
    }
  }, [
    bookingsData,
    roomsData,
    selectedStructureId,
    selectedPropertyTypeId,
    activeFilter,
  ]);

  const data = useMemo(() => tableData ?? [], [tableData]);

  const handleConfirmDeleteOpen = (rowId: number) => {
    setSelectedRowId(rowId);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleCheckinModalOPen = (rowId: number) => {
    setSelectedRowId(rowId);
    setCheckinModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRowId !== null) {
      deleteBookingMutation.mutate(selectedRowId);
      setIsConfirmDeleteModalOpen(false);
      setSelectedRowId(null);
    }
  };
  const handleCancelDelete = () => {
    setIsConfirmDeleteModalOpen(false);
    setSelectedRowId(null);
  };
  const handleCloseCheckinModal = () => {
    setSelectedBooking(null);
    setCheckinModalOpen(false);
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  interface ColumnMetaExtra {
    className?: string;
  }

  const columns = useMemo<ColumnDef<BookingPayload>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 cursor-pointer"
          />
        ),
      },
      {
        accessorKey: "check_in_date",
        header: ({ column }) => {
          return (
            <div className="flex justify-between items-center">
              <div
                className="mx-4 font-semibold text-[14px]"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                Arrival
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
          <div className="capitalize mx-4 text-[15px] font-normal">
            {row.getValue("check_in_date")}
          </div>
        ),
      },
      {
        accessorKey: "check_out_date",
        header: ({ column }) => {
          return (
            <div className="flex justify-between items-center">
              <div
                className="mx-4  font-semibold text-[14px]"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                Departure
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
          <div className="capitalize mx-4 text-[15px] font-normal">
            {row.getValue("check_out_date")}
          </div>
        ),
      },
      {
        accessorKey: "guests",
        header: ({ column }) => (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 font-semibold text-[14px]"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Name
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
        ),
        cell: ({ row }) => {
          const mainGuest = row.original.guests?.find(
            (g) => g.is_main_guest === true,
          );
          return (
            <div
              className="capitalize underline mx-4 text-[15px] font-normal"
              style={{ color: COLOR_VIOLET }}
            >
              {mainGuest ? mainGuest.full_name : "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "propertyName",
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
          <div className="capitalize mx-4 text-[15px] font-normal">
            {row.getValue("propertyName")}
          </div>
        ),
      },
      {
        accessorKey: "adults_count",
        header: ({ column }) => {
          return (
            <div className="flex justify-between items-center">
              <div
                className="mx-4 font-semibold text-[14px]"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                # of adults
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
          <div className="capitalize mx-4 text-[15px] font-normal">
            {row.getValue("adults_count")}
          </div>
        ),
      },
      {
        accessorKey: "children_count",
        header: ({ column }) => {
          return (
            <div className="flex justify-between items-center">
              <div
                className="mx-4 font-semibold text-[14px]"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                # of children
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
          <div className="capitalize mx-4 text-[15px] font-normal">
            {row.getValue("children_count")}
          </div>
        ),
      },
      {
        accessorKey: "total_price",
        header: ({ column }) => {
          return (
            <div className="flex justify-between items-center">
              <div
                className="mx-4  font-semibold text-[14px]"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                Total Amount Paid
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
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("total_price"));
          // Format the amount as a EUR
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "EUR",
          }).format(amount);
          return (
            <div className="mx-4 text-[15px] font-normal">{formatted}</div>
          );
        },
      },
      {
        accessorKey: "commissionableAmount",
        header: ({ column }) => {
          return (
            <div className="flex justify-between items-center">
              <div
                className="mx-4  font-semibold text-[14px]"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                Commissionable Amount
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
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("commissionableAmount"));

          const isValidAmount = !isNaN(amount) && isFinite(amount);

          const formatted = isValidAmount
            ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EUR",
            }).format(amount)
            : "-";

          return (
            <div
              className={`mx-4 text-[15px] font-normal ${
                !isValidAmount ? "text-center" : ""
              }`}
            >
              {formatted}
            </div>
          );
        },
      },
      {
        accessorKey: "platformCommission",
        header: ({ column }) => {
          return (
            <div className="flex justify-between items-center">
              <div
                className="mx-4 font-semibold text-[14px]"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                Platform Commission
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
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("platformCommission"));

          const isValidAmount = !isNaN(amount) && isFinite(amount);

          // Format the amount as a dollar amount
          const formatted = isValidAmount
            ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EUR",
            }).format(amount)
            : "-";

          return (
            <div
              className={`mx-4 text-[15px] font-normal ${
                !isValidAmount ? "text-center" : ""
              }`}
            >
              {formatted}
            </div>
          );
        },
      },
      {
        accessorKey: "platform",
        header: ({ column }) => {
          return (
            <div className="flex justify-between items-center">
              <div
                className="mx-4  font-semibold text-[14px]"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                Platform
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
        cell: ({ row }) => {
          const platform = row.getValue("platform") as string;

          const textColor = getBackgroundColor(platform);
          const bgColor = getBackgroundColorLight(platform);
          const borderStyle = row.index % 2 === 0 ? "1.5px solid white" : "";

          return (
            <div
              className="capitalize font-medium text-[13px] mx-2 px-3 py-0.5 text-center rounded-full"
              style={{
                color: textColor,
                backgroundColor: bgColor,
                border: borderStyle,
              }}
            >
              {platform || "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "checkedInGuests",
        header: ({ column }) => {
          return (
            <div className="flex justify-between items-center">
              <div
                className="mx-4  font-semibold text-[14px]"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                Checked in Guests
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
          <div className="capitalize mx-4 text-[15px] font-normal">
            {row.getValue("checkedInGuests")}
          </div>
        ),
      },
      {
        accessorKey: "checkInStatus",
        header: ({ column }) => {
          return (
            <div className="flex justify-between items-center">
              <div
                className="mx-4  font-semibold text-[14px]"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                Check in Status
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
        cell: ({ row }) => {
          // const status = row.getValue(
          //   "checkInStatus",
          // ) as Booking["checkInStatus"];
          return (
            <div
              className="capitalize text-[14px] font-medium mx-3 px-2 py-0.5 text-center rounded-full"
              style={{
                backgroundColor: `${getStatusBackground("sent")}`,
                color: `${getStatusTextColor("sent")}`,
                border: `${row.index % 2 === 0 ? "1.5px solid white" : ""}`,
              }}
            >
              sent
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => null,
        cell: ({ row }) => {
          const booking = row.original;
          return (
            <div className="flex justify-center">
              <TablePopover
                route={ROUTES.BOOKING_DETAILS}
                id={booking.id}
                uid={booking.uid}
                handleConfirmDeleteOpen={handleConfirmDeleteOpen}
                handleCheckinModalOPen={handleCheckinModalOPen}
              />
            </div>
          );
        },
        meta: {
          className: "sticky right-0 bg-white z-20",
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
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
  });

  const selectedBookings = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div className="w-full mt-5">
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
                  key={row.id}
                  style={{
                    backgroundColor: `${
                      index % 2 === 0 ? "white" : COLOR_LIGHT_BLUE
                    }`,
                    border: "none",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                    >
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
                  className="h-24 text-center font-medium"
                >
                  No bookings data available.
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
        <CheckinModal
          open={checkinModalOpen}
          onCancel={handleCloseCheckinModal}
          onOpenChange={setCheckinModalOpen}
          id={selectedRowId}
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
