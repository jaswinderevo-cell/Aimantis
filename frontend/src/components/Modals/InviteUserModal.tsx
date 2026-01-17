import { COLOR_LIGHT_GRAY, ROLES } from "@/constants/constants";
import { inviteUserSchema } from "@/schemas/inviteUserSchema";
import { StructurePayload, useGetStructures } from "@/services/structure";
import { useInviteUser } from "@/services/structureUsers";
import { handleEnterSubmit } from "@/utils/helper";
import { IconX } from "@tabler/icons-react";
import { getIn, useFormik } from "formik";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { useFormStatus } from "@/utils/disableFormHook";

const InviteUserModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { structureId } = useParams();
  const structureIdNum = Number(structureId);

  const inviteuserMutation = useInviteUser();

  const {
    values,
    errors,
    isValid,
    isSubmitting,
    setFieldValue,
    handleChange,
    resetForm,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues: {
      structure: structureIdNum ?? null,
      email: "",
      role: "Admin",
      message: "",
    },
    enableReinitialize: true,
    validationSchema: inviteUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      inviteuserMutation.mutate(values, {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
          setSubmitting(false);
        },
      });
    },
  });

  //get structures
  const getAllStrucutres = useGetStructures();

  const renderError = (field: string) => {
    const error = getIn(errors, field);
    return typeof error === "string" ? (
      <span className="text-start text-red-500 text-[12px] min-h-6">
        {error}
      </span>
    ) : (
      <span className="text-start text-red-500 text-[12px] min-h-6">
        &nbsp;
      </span>
    );
  };

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: inviteuserMutation.isPending,
  });

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[600px] sm:rounded-lg px-4 py-6 sm:px-6 sm:py-6">
          <DialogHeader>
            <DialogTitle className="mb-2 text-[20px] flex justify-between items-center">
              Invite New User
              <IconX
                onClick={() => onOpenChange(false)}
                color="red"
                className="hover:bg-gray-100 rounded-md cursor-pointer"
              />
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <fieldset disabled={isFormDisabled}>
              <div>
                <Label
                  className="text-[14px] font-medium mb-2"
                  style={{ color: COLOR_LIGHT_GRAY }}
                  htmlFor="email"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  className="h-[40px]"
                  style={{ borderColor: COLOR_LIGHT_GRAY }}
                  type="email"
                  placeholder="user@example.com"
                  required
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleEnterSubmit(e, isValid, handleSubmit)}
                />
                {renderError("email")}
              </div>

              <div>
                <Label
                  htmlFor="structure"
                  className="text-[14px] font-semiBold mb-1 block"
                  style={{ color: COLOR_LIGHT_GRAY }}
                >
                  Select Structure
                </Label>

                <Select
                  value={values.structure ? String(values.structure) : ""}
                  onValueChange={(value) =>
                    setFieldValue("structure", Number(value))
                  }
                >
                  <SelectTrigger
                    className="w-full capitalize"
                    style={{ borderColor: COLOR_LIGHT_GRAY }}
                  >
                    <SelectValue placeholder="Select Structure" />
                  </SelectTrigger>

                  <SelectContent className="bg-white capitalize">
                    {getAllStrucutres.data?.map((item: StructurePayload) => (
                      <SelectItem
                        key={item.id}
                        value={String(item.id)}
                        className="cursor-pointer data-[highlighted]:bg-gray-100"
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {renderError("structure")}
              </div>

              <div>
                <Label
                  htmlFor="structure"
                  className="text-[14px] font-semiBold mb-1 block"
                  style={{ color: COLOR_LIGHT_GRAY }}
                >
                  Select Role
                </Label>

                <Select
                  value={values.role}
                  onValueChange={(value) => setFieldValue("role", value)}
                >
                  <SelectTrigger
                    className="w-full capitalize"
                    style={{ borderColor: COLOR_LIGHT_GRAY }}
                  >
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>

                  <SelectContent className="bg-white capitalize">
                    {ROLES.map((item, index) => (
                      <SelectItem
                        key={index}
                        value={item.value}
                        className="cursor-pointer data-[highlighted]:bg-gray-100"
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {renderError("role")}
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-[14px] font-medium mb-2"
                  style={{ color: COLOR_LIGHT_GRAY }}
                >
                  Personal Message (Optional)
                </Label>
                <Textarea
                  style={{ borderColor: COLOR_LIGHT_GRAY }}
                  id="message"
                  placeholder="Add a personal message to the invitation..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4 mt-5">
                <Button
                  type="submit"
                  className="btn w-full md:w-fit"
                  disabled={
                    isSubmitting || inviteuserMutation.isPending || !isValid
                  }
                >
                  {isSubmitting || inviteuserMutation.isPending
                    ? "Sending..."
                    : "Send Invitation"}
                </Button>
              </div>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteUserModal;
