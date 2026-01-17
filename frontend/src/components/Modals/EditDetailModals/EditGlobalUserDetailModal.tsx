import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { inviteUserSchema } from "@/schemas/inviteUserSchema";
import { UserResponsePayload } from "@/services/userManagement";
import { handleEnterSubmit } from "@/utils/helper";
import { IconX } from "@tabler/icons-react";
import { getIn, useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "sonner";

const permissionsOptions = [
  { label: "All", value: "all" },
  { label: "Reports", value: "reports" },
  { label: "Bookings", value: "bookings" },
  { label: "Guests", value: "guests" },
];

const EditUserDetailModal = ({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponsePayload | null;
}) => {
  console.log("Selected", user);

  const {
    values,
    errors,
    isValid,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.username || "",
      email: user?.email || "",
      message: user?.email || "",
      permissions: [],
    },
    // validationSchema: inviteUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values);
      setSubmitting(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("successfull");

        onOpenChange(false);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed! Please try again.");
      }
    },
  });

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

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

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-2 text-[20px] font-bold flex justify-between items-center">
              Edit User
              <IconX
                onClick={() => onOpenChange(false)}
                color="red"
                className="hover:bg-gray-100 rounded-md cursor-pointer"
              />
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div>
              <Label
                className="text-gray-700 text-[14px] font-medium mb-2"
                htmlFor="name"
              >
                Name
              </Label>
              <Input
                id="name"
                className="h-[40px] text-sm"
                type="text"
                placeholder="enter name"
                required
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleEnterSubmit(e, isValid, handleSubmit)}
              />
              {renderError("name")}
            </div>
            <div>
              <Label
                className="text-gray-700 text-[14px] font-medium mb-2"
                htmlFor="email"
              >
                Email Address
              </Label>
              <Input
                id="email"
                className="h-[40px] text-sm"
                type="email"
                placeholder="user@example.com"
                readOnly
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(e) => handleEnterSubmit(e, isValid, handleSubmit)}
              />
              {renderError("email")}
            </div>

            <div>
              <Label
                htmlFor="role"
                className="text-gray-700 text-[14px] font-medium mb-2"
              >
                Permissions
              </Label>
              <MultiSelectDropdown
                name="permissions"
                options={permissionsOptions}
                value={values.permissions}
                onChange={(val) => setFieldValue("permissions", val || [])}
                onBlur={handleBlur}
                placeholder="Permissions"
                borderColor="black"
              />
              {renderError("permissions")}
            </div>

            <div>
              <Label
                htmlFor="message"
                className="text-gray-700 text-[14px] font-medium mb-2"
              >
                Personal Message (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to the invitation..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-4 mt-5">
              <Button
                type="submit"
                className="btn"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditUserDetailModal;
