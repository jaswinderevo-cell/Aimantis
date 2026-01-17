"use client";

import type React from "react";

import { GlobalUserManagementTable } from "@/components/GlobalUserManagementTable";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  COLOR_BLUE,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_SILVER,
  COLOR_VIOLET,
} from "@/constants/constants";
import { Clock, Search, Shield, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

import InviteUserModal from "@/components/Modals/InviteUserModal";
import { Button } from "@/components/ui/Button";
import { useGetAllUsers, UserResponsePayload } from "@/services/userManagement";

interface Invitation {
  id: string;
  email: string;
  role: string;
  sentDate: string;
  expiresDate: string;
  status: "pending" | "expired";
}

const mockInvitations: Invitation[] = [
  {
    id: "1",
    email: "alex.brown@email.com",
    role: "manager",
    sentDate: "2023-12-15",
    expiresDate: "2023-12-22",
    status: "pending",
  },
  {
    id: "2",
    email: "lisa.white@email.com",
    role: "staff",
    sentDate: "2023-12-10",
    expiresDate: "2023-12-17",
    status: "expired",
  },
];

export default function UserManagement() {
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isOpenModal, setIsOpenModal] = useState(false);

  //get all users
  const getAllUsers = useGetAllUsers();
  const usersRes = getAllUsers?.data?.data?.results;

  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "staff",
    message: "",
  });

  const statusOverView = [
    { label: "Total Users", value: usersRes?.length, icon: Users },
    {
      label: "Active Users",
      value: usersRes?.filter((u: UserResponsePayload) => u.is_active).length,
      icon: UserCheck,
    },
    {
      label: "Pending Invites",
      value: mockInvitations.filter((i) => i.status === "pending").length,
      icon: Clock,
    },
    {
      label: "Admins",
      value: usersRes?.filter((u: UserResponsePayload) =>
        u.roles.some((r) => r.name === "Admin"),
      ).length,
      icon: Shield,
    },
  ];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email: inviteForm.email,
      role: inviteForm.role,
      sentDate: new Date().toISOString().split("T")[0],
      expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "pending",
    };
    setInvitations((prev) => [...prev, newInvitation]);
    setInviteForm({ email: "", role: "staff", message: "" });
    setIsInviteDialogOpen(false);
  };

  const resendInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId
          ? {
            ...inv,
            sentDate: new Date().toISOString().split("T")[0],
            expiresDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            status: "pending" as const,
          }
          : inv,
      ),
    );
  };

  const cancelInvitation = (invitationId: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className="p-5 min-h-screen"
      style={{ backgroundColor: COLOR_LIGHT_BLUE }}
    >
      <div className="space-y-6">
        <div className="flex gap-2 flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-gray-600">
              Grand Plaza Hotel - Manage team access and permissions
            </p>
          </div>
          <Button
            onClick={() => setIsOpenModal(true)}
            className="btn text-white"
          >
            <FaPlus size={16} /> Invite User
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="overflow-x-auto scr pb-2 scrollbar-hidden">
          <div className="flex gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 scrollbar-hidden">
            {statusOverView.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
              style={{ borderColor: COLOR_LIGHT_SILVER }}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full border-gray-300 md:w-32 bg-white ">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem
                  className="cursor-pointer data-[highlighted]:bg-gray-100 "
                  value="all"
                >
                  All Status
                </SelectItem>
                <SelectItem
                  className="cursor-pointer data-[highlighted]:bg-gray-100 "
                  value="active"
                >
                  Active
                </SelectItem>
                <SelectItem
                  className="cursor-pointer data-[highlighted]:bg-gray-100 "
                  value="pending"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  className="cursor-pointer data-[highlighted]:bg-gray-100 "
                  value="inactive"
                >
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-10">All Users</h2>

        <div className="bg-white p-2 rounded-md border border-gray-300">
          <GlobalUserManagementTable
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            users={usersRes}
          />
        </div>
      </div>
      <InviteUserModal open={isOpenModal} onOpenChange={setIsOpenModal} />
    </div>
  );
}
