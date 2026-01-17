import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import CredentialsIcon from "@/icons/CredentialsIcon";
import { AlloggiatiSchema } from "@/schemas/alloggiati";
import { IconX } from "@tabler/icons-react";
import { getIn, useFormik } from "formik";
import React, { useEffect } from "react";
import { TbDeviceFloppy } from "react-icons/tb";
import { toast } from "sonner";

interface AlloggiatiModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AlloggiatiModal: React.FC<AlloggiatiModalProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    isSubmitting,
    values,
    errors,
    isValid,
  } = useFormik({
    validationSchema: AlloggiatiSchema,
    enableReinitialize: true,
    initialValues: {
      credentialName: "",
      credentialType: "",
      userName: "",
      password: "",
      certifiedPassword: "",
      webServiceKey: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      console.log(values);
      try {
        toast.success("Form submitted successfully!");
        resetForm();
        onOpenChange(false);
        setSubmitting(false);
      } catch (error) {
        toast.error("Something went wrong", {
          description: (error as Error).message,
        });
      }
    },
  });

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  //show fields errors//
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Add a new credential
          </h2>
          <IconX
            color="red"
            className="cursor-pointer hover:bg-gray-100 rounded-md"
            onClick={() => onOpenChange(false)}
          />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 pb-6">
            {/* Credentials Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CredentialsIcon fill="black" height="20" width="20" />
                <h3 className="text-[16px] font-semibold text-black">
                  Credentials
                </h3>
              </div>

              {/* Credential Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="credentialName"
                  className="text-sm font-normal text-gray-700"
                >
                  Credential Name
                </Label>
                <Input
                  id="credentialName"
                  type="text"
                  placeholder="Credential Name"
                  value={values.credentialName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-10 px-3 border-gray-300"
                  style={{ fontSize: "17px" }}
                />
                {renderError("credentialName")}
              </div>

              {/* Credential Type */}
              <div className="space-y-2">
                <Label
                  htmlFor="credentialType"
                  className="text-sm font-normal text-gray-700"
                >
                  Credential type
                </Label>
                <Select
                  value={values.credentialType}
                  onValueChange={(e) => setFieldValue("credentialType", e)}
                >
                  <SelectTrigger
                    className="w-full text-[17px] border-gray-300 [placeholder]:text-gray-600"
                    style={{ height: "40px" }}
                  >
                    <SelectValue placeholder="Select credential type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white cursor-pointer">
                    <SelectItem
                      className="cursor-pointer data-[highlighted]:bg-gray-100"
                      value="With Digital Certificate"
                    >
                      With Digital Certificate
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer data-[highlighted]:bg-gray-100"
                      value="With Code"
                    >
                      With Code
                    </SelectItem>
                  </SelectContent>
                </Select>
                {renderError("credentialType")}
              </div>

              {/* User Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="userName"
                  className="text-sm font-normal text-gray-700"
                >
                  User name
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Username"
                  value={values.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-10 px-3 border-gray-300"
                  style={{ fontSize: "17px" }}
                />
                {renderError("userName")}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-normal text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  autoComplete="off"
                  type="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full h-10 px-3 border-gray-300"
                  style={{ fontSize: "17px" }}
                />
                {renderError("password")}
              </div>

              {/* Certified Password */}
              {values.credentialType === "With Digital Certificate" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="certifiedPassword"
                    className="text-sm font-normal text-gray-700"
                  >
                    Certified Password
                  </Label>
                  <Input
                    id="certifiedPassword"
                    type="password"
                    placeholder="Certified Password"
                    value={values.certifiedPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full h-10 px-3 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("certifiedPassword")}
                </div>
              )}

              {/* Web Service Key */}
              {values.credentialType === "With Code" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="webServiceKey"
                    className="text-sm font-normal text-gray-700"
                  >
                    Web Service Key
                  </Label>
                  <Input
                    id="webServiceKey"
                    type="password"
                    placeholder="Web Service Key"
                    value={values.webServiceKey}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full h-10 px-3 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("webServiceKey")}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex gap-4 justify-end mt-7 mb-3">
              <Button
                type="submit"
                className="btn text-[14px]"
                disabled={!isValid}
              >
                <TbDeviceFloppy className="mr-2" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AlloggiatiModal;
