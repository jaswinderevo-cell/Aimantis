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
import { ArrowUpDown, EllipsisVertical } from "lucide-react";
import { TbSettings } from "react-icons/tb";
import EditUserDetailModal from "./Modals/EditDetailModals/EditGlobalUserDetailModal";
import { UserResponsePayload } from "@/services/userManagement";
import { getGlobalUsersStatusColor } from "@/utils/helper";

interface GlobalUserTableProps {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  users: UserResponsePayload[];
}

export const GlobalUserManagementTable: React.FC<GlobalUserTableProps> = ({
  searchTerm,
  statusFilter,
  users,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] =
    React.useState<UserResponsePayload | null>(null);

  const handleEditModalOpen = (user: UserResponsePayload) => {
    setIsEditModalOpen(true);
    setSelectedUser(user);
  };

  //filter users//
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    return users?.filter((user) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [users, searchTerm, statusFilter]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<UserResponsePayload>[] = [
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
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
        );
      },
      cell: ({ row }) => (
        <div className="capitalize mx-4 text-[15px] font-normal">
          {row.getValue("username")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4  font-semibold text-[14px]"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Email
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
        <div className="mx-4 text-[15px] font-normal">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 font-semibold text-[14px]"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Status
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
        const user = row.original;
        let userStatus = "";
        if (user.is_active) {
          userStatus = "active";
        } else {
          userStatus = "inactive";
        }
        return (
          <div className={`mx-4 text-[15px] font-medium p-0`}>
            <button
              className={`px-2 rounded-full cursor-default ${getGlobalUsersStatusColor(userStatus.toLowerCase())}`}
            >
              {userStatus}
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: "date_joined",
      header: ({ column }) => {
        return (
          <div className="flex justify-between items-center">
            <div
              className="mx-4 font-semibold text-[14px]"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Date joined
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
        const user = row.original;      
        const fullStr = user.date_joined;
        const dateJoined = fullStr.split("T")[0];
        return (
          <div className="capitalize mx-4 text-[15px] font-normal">
            {dateJoined}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center justify-center gap-4">
            <TbSettings
              onClick={() => handleEditModalOpen(user)}
              size={18}
              className="hover:bg-gray-100 rounded-md cursor-pointer"
            />
            <EllipsisVertical
              size={18}
              className="hover:bg-gray-100 rounded-md cursor-pointer"
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredUsers,
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
                  key={row.id}
                  style={{
                    backgroundColor: `${
                      index % 2 === 0 ? "white" : COLOR_LIGHT_BLUE
                    }`,
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
      <EditUserDetailModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={selectedUser}
      />
    </div>
  );
};
