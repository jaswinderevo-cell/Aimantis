"use client";

import DeleteConfirmModal from "@/components/Modals/ConfirmDelete";
import InviteUserModal from "@/components/Modals/InviteUserModal";
import NoDataRedirectComponent from "@/components/NoDataRedirectComponent";
import { StructureUsersTable } from "@/components/StructureUsersTable";
import { Badge } from "@/components/ui/Badge";
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
  COLOR_BLUE,
  COLOR_GRADIENT_LIGHT,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_SILVER,
  COLOR_VIOLET,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { useGetStructureById, useGetStructures } from "@/services/structure";
import {
  GetInvitationsResponse,
  useCancelInvitations,
  useDeleteInvitation,
  useGetAllInvitations,
  useGetAllStructuresUsers,
  useGetStructureUsers,
  useResendInvitation,
} from "@/services/structureUsers";
import SharedBreadCrumb from "@/utils/sharedBreadCrumb";
import {
  ArrowLeft,
  Clock,
  Mail,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";

export default function StructureUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [invitations, setInvitations] = useState<GetInvitationsResponse[]>([]);
  const [activeAction, setActiveAction] = useState<{
    resend?: string | null;
    cancel?: string | null;
    delete?: string | null;
  }>({});
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const { structureId } = useParams();
  const strunctureIdNum = Number(structureId);

  //get structure by id
  const getStructureById = useGetStructureById(strunctureIdNum);

  //get stucture users
  const getStructureUsers = useGetStructureUsers(strunctureIdNum);
  const structureUsersRes = getStructureUsers?.data;

  // get all invitations
  const { data: allInvitations = [], isSuccess: isAllInvitationsSuccess } =
    useGetAllInvitations();

  //filter invitations
  const invitationsData = useMemo(() => {
    if (!isAllInvitationsSuccess) return [];
    return strunctureIdNum
      ? allInvitations.filter(
        (i: GetInvitationsResponse) => i.structure === strunctureIdNum,
      )
      : allInvitations;
  }, [strunctureIdNum, allInvitations, isAllInvitationsSuccess]);

  useEffect(() => {
    if (isAllInvitationsSuccess) {
      setInvitations(invitationsData);
    }
  }, [invitationsData, isAllInvitationsSuccess]);

  //get allStructuresUsers
  const { data: allStructuresUsers = [], isSuccess: isAllUsersSuccess } =
    useGetAllStructuresUsers();

  const allStructuresUsersData = useMemo(() => {
    if (!isAllUsersSuccess) return [];
    return strunctureIdNum ? structureUsersRes : allStructuresUsers;
  }, [strunctureIdNum, structureUsersRes, allStructuresUsers]);

  const statusOverView = [
    {
      label: "Total Users",
      value: allStructuresUsersData?.length || 0,
      icon: Users,
    },
    {
      label: "Active Users",
      value: allStructuresUsersData?.length || 0,
      icon: UserCheck,
    },
    {
      label: "Pending Invites",
      value: invitations?.filter(
        (i: GetInvitationsResponse) => i.status === "pending",
      ).length,
      icon: Clock,
    },
    {
      label: "Admins",
      value: allStructuresUsersData?.length || 0,
      icon: Shield,
    },
  ];

  //resend invitations
  const resendInvitation = useResendInvitation();

  //cancel invitations
  const cancelInvitation = useCancelInvitations();

  //delete invitations
  const deleteInvitation = useDeleteInvitation();

  const handleResend = (id: string) => {
    setActiveAction((prev) => ({ ...prev, resend: id }));
    resendInvitation.mutate(id, {
      onSettled: () => setActiveAction((prev) => ({ ...prev, resend: null })),
    });
  };

  const handleCancel = (id: string) => {
    setActiveAction((prev) => ({ ...prev, cancel: id }));
    cancelInvitation.mutate(id, {
      onSettled: () => setActiveAction((prev) => ({ ...prev, cancel: null })),
    });
  };

  const handleDelete = (id: string) => {
    setActiveAction((prev) => ({ ...prev, delete: id }));
    deleteInvitation.mutate(id, {
      onSettled: () => setActiveAction((prev) => ({ ...prev, delete: null })),
    });
  };

  const handleDeleteModalOpen = (id: string) => {
    setSelectedDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDeleteId) {
      handleDelete(selectedDeleteId);
      setIsConfirmDeleteModalOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
      return "bg-red-100 text-red-800";
    case "expired":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
    }
  };

  // Fallback for empty users list
  const getAllStrucutres = useGetStructures();
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
          route={ROUTES.STRUCTURES}
        />
      </div>
    );
  }
  return (
    <div
      className="p-5 min-h-screen"
      style={{ backgroundColor: COLOR_LIGHT_BLUE }}
    >
      <SharedBreadCrumb padding="pt-4" />

      <div className="space-y-6 pt-8 md:pt-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {structureId && (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Link to="/portal/properties/structures">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Structure
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    User Management
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    {getStructureById?.data?.name + " -"}{" "}
                    <span> Manage team access and permissions</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* button */}
          <div
            className={`flex ${structureId ? "w-fit" : "w-full"} justify-end`}
          >
            <button
              onClick={() => setIsOpenModal(true)}
              className="btn flex items-center justify-center gap-2 rounded-md px-3 sm:px-4 py-2 font-medium text-white text-sm sm:text-[15px] hover:cursor-pointer"
            >
              <FaPlus size={16} /> Invite User
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="overflow-x-auto scr pb-2 scrollbar-hidden">
          <div className="flex gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 scrollbar-hidden">
            {statusOverView.map((item, idx) => {
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
              <SelectTrigger className="w-full border-gray-300 lg:w-32 bg-white">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* table */}
          <div className="bg-white p-4 rounded-lg border border-gray-300 lg:col-span-8 shadow-sm">
            <StructureUsersTable
              searchTerm={searchTerm}
              roleFilter={roleFilter}
              statusFilter={statusFilter}
              users={allStructuresUsersData}
            />
          </div>

          {/* pending invitations card */}
          <div className="lg:col-span-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent className="scr min-h-[250px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {invitations?.length > 0 ? (
                  <div className="space-y-4">
                    {invitations?.map((invitation: GetInvitationsResponse) => {
                      const createdAtStr = invitation.created_at;
                      const creationDate = createdAtStr?.split("T")[0];
                      return (
                        <div
                          key={invitation.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row lg:flex-col gap-2 items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {invitation.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                Sent: {creationDate}
                              </p>
                            </div>
                            <Badge
                              className={getStatusColor(invitation.status)}
                            >
                              {invitation.status}
                            </Badge>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <div className="flex gap-2 justify-between w-full">
                              <div className="flex gap-2">
                                {invitation.status === "pending" && (
                                  <>
                                    {/* Resend Button */}
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleResend(invitation.id)
                                      }
                                      disabled={
                                        activeAction.resend === invitation.id
                                      }
                                      className="btn text-white"
                                    >
                                      {activeAction.resend === invitation.id
                                        ? "Sending..."
                                        : "Resend"}
                                    </Button>

                                    {/* Cancel Button */}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="hover:bg-gray-100 flex items-center gap-1"
                                      onClick={() =>
                                        handleCancel(invitation.id)
                                      }
                                      disabled={
                                        activeAction.cancel === invitation.id
                                      }
                                    >
                                      {activeAction.cancel === invitation.id
                                        ? "Cancelling..."
                                        : "Cancel"}
                                    </Button>
                                  </>
                                )}

                                {invitation.status !== "pending" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleResend(invitation.id)}
                                    disabled={
                                      activeAction.resend === invitation.id
                                    }
                                    className="btn text-white"
                                  >
                                    {activeAction.resend === invitation.id
                                      ? "Sending..."
                                      : "Resend"}
                                  </Button>
                                )}
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={() =>
                                  handleDeleteModalOpen(invitation.id)
                                }
                                disabled={activeAction.delete === invitation.id}
                                className={`
                                flex items-center font-medium p-2 rounded-lg cursor-pointer
                                hover:text-red-600 hover:bg-gray-100 transition-colors
                                ${
                        activeAction.delete === invitation.id
                          ? "text-red-300 cursor-not-allowed opacity-60 hover:bg-transparent hover:text-red-300"
                          : "text-red-500"
                        }
                              `}
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Mail className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      No pending invitations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <InviteUserModal open={isOpenModal} onOpenChange={setIsOpenModal} />
      <DeleteConfirmModal
        open={isConfirmDeleteModalOpen}
        onCancel={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
