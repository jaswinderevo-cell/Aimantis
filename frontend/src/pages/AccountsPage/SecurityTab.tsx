import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Shield } from "lucide-react";
import { useState } from "react";

import {
  COLOR_ATHENS_GRAY,
  COLOR_EBONY,
  COLOR_LIGHT_GREEN,
  COLOR_LIGHT_RED,
  COLOR_LIGHT_SILVER,
  COLOR_OXFORD_BLUE,
  COLOR_PALE_SKY,
} from "@/constants/constants";

import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { MyProfileSecuritySchema } from "@/schemas/myProfileSecurity";
import {
  ChangePasswordPayload,
  useChangePassword,
  useDeleteAllSessions,
  useDeleteSession,
  useGetCurrentSessions,
  useGetTwoFactorAuthentication,
  useTwoFactorAuthentication,
} from "@/services/myAccount";
import { getIn, useFormik } from "formik";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { TbDeviceFloppy, TbEye, TbEyeOff, TbLock } from "react-icons/tb";
import { formatDistanceToNow } from "date-fns";

const SecurityTab = () => {
  const [isShowcurrent_password, setIsShowcurrent_password] = useState(false);
  const [isShownew_password, setIsShownew_password] = useState(false);

  const activeSessions = [];
  const inActiveSessions = [];

  //change password
  const changePasswordMutation = useChangePassword();

  //get 2fa
  const get2fa = useGetTwoFactorAuthentication();
  const resData = get2fa?.data?.data?.two_factor_enabled;
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(resData);

  //update 2fa
  const twoFactorAuthMutation = useTwoFactorAuthentication();
  const handle2faToggle = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    twoFactorAuthMutation.mutate(
      { two_factor_enabled: checked },
      {
        onSuccess: () => {
          console.log("2FA updated successfully");
        },
        onError: (err) => {
          console.error("Failed to update 2FA", err);
        },
      },
    );
  };

  //get current sessions
  const getCurrentSessions = useGetCurrentSessions(false);
  const sessionsData = getCurrentSessions?.data?.data ?? [];

  // filter the active and inactive sessions
  for (const session of sessionsData) {
    if (session.is_active) {
      activeSessions.push(session);
    } else {
      inActiveSessions.push(session);
    }
  }

  //delete session
  const deleteSessionMutation = useDeleteSession();

  //delete all sessions
  const deleteAllSessionsMutation = useDeleteAllSessions();

  const {
    handleSubmit,
    handleChange,
    isSubmitting,
    handleBlur,
    resetForm,
    values,
    errors,
    isValid,
  } = useFormik<ChangePasswordPayload>({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    enableReinitialize: true,
    validationSchema: MyProfileSecuritySchema,

    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      changePasswordMutation.mutate(values, {
        onSuccess: () => {
          setSubmitting(false);
          resetForm();
        },
      });
    },
  });

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
    <>
      {/* Change Password */}
      <Card className="p-[24px]" style={{ borderColor: COLOR_ATHENS_GRAY }}>
        <CardHeader className="p-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle className="text-base sm:text-lg font-semibold">
              Change Password
            </CardTitle>
          </div>
          <CardDescription
            className="text-[14px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-[16px] p-0">
          <div className="max-w-md space-y-4">
            {/* Current Password */}
            <form onSubmit={handleSubmit}>
              {/* Current Password */}
              <Label
                htmlFor="current_password"
                className="text-[14px]"
                style={{ color: COLOR_OXFORD_BLUE }}
              >
                Current Password
              </Label>
              <div className="relative">
                {isShowcurrent_password ? (
                  <div
                    className="absolute top-2 right-2 pl-3 text-gray-600 cursor-pointer"
                    onClick={() => setIsShowcurrent_password((prev) => !prev)}
                  >
                    <TbEyeOff
                      size={20}
                      className="hover:bg-gray-100 rounded-md"
                    />
                  </div>
                ) : (
                  <div
                    className="absolute top-2 right-2 pl-3 text-gray-600 cursor-pointer"
                    onClick={() => setIsShowcurrent_password((prev) => !prev)}
                  >
                    <TbEye size={20} className="hover:bg-gray-100 rounded-md" />
                  </div>
                )}
                <Input
                  id="current_password"
                  name="current_password"
                  type={isShowcurrent_password ? "text" : "password"}
                  autoComplete="current-password"
                  style={{ borderColor: COLOR_LIGHT_SILVER }}
                  value={values.current_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {renderError("current_password")}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="new_password"
                  className="text-[14px]"
                  style={{ color: COLOR_OXFORD_BLUE }}
                >
                  New Password
                </Label>
                <div className="relative">
                  {isShownew_password ? (
                    <div
                      className="absolute top-2 right-2 pl-3 text-gray-600 cursor-pointer"
                      onClick={() => setIsShownew_password((prev) => !prev)}
                    >
                      <TbEyeOff
                        size={20}
                        className="hover:bg-gray-100 rounded-md"
                      />
                    </div>
                  ) : (
                    <div
                      className="absolute top-2 right-2 pl-3 text-gray-600 cursor-pointer"
                      onClick={() => setIsShownew_password((prev) => !prev)}
                    >
                      <TbEye
                        size={20}
                        className="hover:bg-gray-100 rounded-md"
                      />
                    </div>
                  )}
                  <Input
                    id="new_password"
                    name="new_password"
                    type={isShownew_password ? "text" : "password"}
                    autoComplete="new-password"
                    style={{ borderColor: COLOR_LIGHT_SILVER }}
                    value={values.new_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {renderError("new_password")}
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirm_password"
                  className="text-[14px]"
                  style={{ color: COLOR_OXFORD_BLUE }}
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  style={{ borderColor: COLOR_LIGHT_SILVER }}
                  value={values.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {renderError("confirm_password")}
              </div>

              {/* Password requirements */}
              <div
                className="rounded-md border p-[16px] space-y-2"
                style={{ backgroundColor: COLOR_ATHENS_GRAY }}
              >
                <h2
                  className="font-bold text-[14px]"
                  style={{ color: COLOR_EBONY }}
                >
                  Password Requirements:
                </h2>

                <ul className="space-y-[8px]">
                  {[
                    "At least 8 characters long",
                    "Contains uppercase and lowercase letters",
                    "Contains at least one number",
                    "Contains at least one special character",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="mt-[2px]" style={{ color: COLOR_EBONY }}>
                        ✓
                      </span>
                      <span
                        className="text-[14px]"
                        style={{ color: COLOR_EBONY }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit */}
              <div className="flex justify-center sm:justify-start pt-4">
                <Button
                  type="submit"
                  className="btn text-[14px] w-full sm:w-auto min-w-[120px]"
                  disabled={
                    !isValid || isSubmitting || changePasswordMutation.isPending
                  }
                >
                  <TbDeviceFloppy className="mr-2" size={16} />
                  {changePasswordMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card
        className="mt-8 p-[24px]"
        style={{ borderColor: COLOR_ATHENS_GRAY }}
      >
        <CardHeader className="p-0">
          <div className="flex items-center gap-2">
            <TbLock className="w-5 h-5" />
            <CardTitle
              className="text-base text-[18px] font-bold"
              style={{ color: COLOR_EBONY }}
            >
              Two-Factor Authentication
            </CardTitle>
          </div>
          <CardDescription
            className="text-[14px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Label
                htmlFor="enable2fa"
                className="text-[16px] font-medium"
                style={{ color: COLOR_EBONY }}
              >
                Enable 2FA
              </Label>
              <p className="text-[14px]" style={{ color: COLOR_PALE_SKY }}>
                Secure your account with two-factor authentication
              </p>
            </div>
            <Switch
              className={`data-[state=unchecked]:bg-[#D1D5DB] data-[state=checked]:bg-[#2563EB]`}
              id="enable2fa"
              checked={twoFactorEnabled}
              onCheckedChange={handle2faToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Login Activity */}
      <Card
        className="mt-8 p-[24px]"
        style={{ borderColor: COLOR_ATHENS_GRAY }}
      >
        <CardHeader className="p-0">
          <div className="flex items-center gap-2">
            <HiOutlineShieldCheck className="w-5 h-5" />
            <CardTitle className="text-base sm:text-lg font-semibold">
              Login Activity
            </CardTitle>
          </div>
          <CardDescription
            className="text-[14px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Recent login attempts and active sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-[16px] p-0">
          {/* Current Session */}
          <div className="flex flex-col gap-5 md:gap-0 md:flex-row items-center justify-between p-[13px]">
            <p
              className="text-[16px] font-medium"
              style={{ color: COLOR_EBONY }}
            >
              Current Sessions
            </p>
            <Button
              onClick={() => deleteAllSessionsMutation.mutate()}
              variant="ghost"
              className="text-sm font-medium text-center w-full md:w-fit rounded-full text-red-500 hover:text-red-500 hover:bg-red-100 bg-red-50"
            >
              Delete all
            </Button>
          </div>
          {activeSessions.length > 0 ? (
            activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-5 md:gap-0 md:flex-row items-center justify-between p-[13px] border rounded-lg"
              >
                <p>
                  <span
                    className="font-normal text-[14px]"
                    style={{ color: COLOR_PALE_SKY }}
                  >
                    {session.browser} on {session.operating_system}
                  </span>
                </p>

                <div className="flex gap-5">
                  <button
                    className="text-[12px] cursor-default font-medium text-center py-[4px] px-[12px] rounded-full"
                    style={{
                      color: "#166534",
                      backgroundColor: COLOR_LIGHT_GREEN,
                    }}
                  >
                    Active
                  </button>
                  <Button
                    onClick={() => deleteSessionMutation.mutate(session.id)}
                    variant="ghost"
                    className="text-[12px] bg-red-50 font-medium text-center rounded-full text-red-500 hover:text-red-500 hover:bg-red-100"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No active sessions</p>
          )}

          {/* Previous Session */}
          <div className="">
            <p
              className="text-[16px] font-medium"
              style={{ color: COLOR_EBONY }}
            >
              Previous Session
            </p>
          </div>
          {inActiveSessions.length > 0 ? (
            inActiveSessions.slice(0, 5).map((session) => {
              return (
                <div className="flex flex-col gap-5 md:gap-0 md:flex-row items-center justify-between p-[13px] border rounded-lg">
                  <p>
                    <span
                      className="font-normal text-[14px]"
                      style={{ color: COLOR_PALE_SKY }}
                    >
                      {session.browser} on {session.operating_system}
                      {" • "}{" "}
                      {formatDistanceToNow(new Date(session.last_activity), {
                        addSuffix: true,
                      })}
                    </span>
                  </p>
                  <button
                    className="text-[12px] cursor-default font-medium text-center py-[4px] px-[12px] rounded-md"
                    style={{
                      color: "#DC2626",
                      backgroundColor: COLOR_LIGHT_RED,
                    }}
                  >
                    Revoke
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No inactive sessions</p>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SecurityTab;
