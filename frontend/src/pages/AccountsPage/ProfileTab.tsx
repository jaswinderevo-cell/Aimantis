import DropzoneUploader from "@/components/DropZoneUploader";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  COLOR_ATHENS_GRAY,
  COLOR_BLUE,
  COLOR_EBONY,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_SILVER,
  COLOR_OXFORD_BLUE,
  COLOR_PALE_SKY,
} from "@/constants/constants";
import { UserProfileSchema } from "@/schemas/userProfile";
import {
  useGetMyProfile,
  UserProfilePayload,
  useUpdateProfile,
} from "@/services/myAccount";
import { useFormStatus } from "@/utils/disableFormHook";
import { uploadFilesToCloudinary } from "@/utils/upload";
import { getIn, useFormik } from "formik";
import { FaRegUser } from "react-icons/fa";
import { TbBuilding, TbDeviceFloppy } from "react-icons/tb";

const ProfileTab = () => {
  //get profile
  const getMyProfile = useGetMyProfile();
  const existingUserData = getMyProfile?.data?.data;

  //update profile data
  const updateProfileMutation = useUpdateProfile();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    isSubmitting,
    values,
    errors,
  } = useFormik<UserProfilePayload>({
    enableReinitialize: true,
    initialValues: {
      first_name: existingUserData?.first_name ?? "",
      last_name: existingUserData?.last_name ?? "",
      email: existingUserData?.email ?? "",
      phone_number: existingUserData?.phone_number ?? "",
      company: existingUserData?.company ?? "",
      job_title: existingUserData?.job_title ?? "",
      company_logo_url: existingUserData?.company_logo_url ?? "",
      _localFiles: [],
      image_url: existingUserData?.image_url ?? "",
    },
    validationSchema: UserProfileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      console.log("Form Values:", values);
      //upload image
      const uploadedUrls = await uploadFilesToCloudinary(
        values._localFiles || [],
      );
      if (uploadedUrls.length > 0) {
        values.company_logo_url = uploadedUrls[0];
      }
      //call mutation
      updateProfileMutation.mutate(values, {
        onSuccess: () => {
          setSubmitting(false);
          resetForm();
        },
      });
    },
  });

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: updateProfileMutation.isPending,
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
    <div className="flex flex-col lg:flex-row gap-[24px]">
      <form onSubmit={handleSubmit} className="w-full">
        <fieldset
          disabled={isFormDisabled}
          className="w-full flex flex-col lg:flex-row gap-[24px]"
        >
          {/* Left Card – Personal Info */}
          <Card
            className="w-full lg:w-2/3 p-[24px] border-1"
            style={{ borderColor: COLOR_ATHENS_GRAY }}
          >
            <CardHeader className="p-0">
              <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 items-center">
                <FaRegUser size={18} className="shrink-0" />
                <CardTitle className="text-[16px] sm:text-[18px] font-bold">
                  Personal Information
                </CardTitle>
              </div>
              <CardDescription
                className="text-[14px] font-normal"
                style={{ color: COLOR_PALE_SKY }}
              >
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <Label
                      htmlFor="first_name"
                      className="text-[14px] font-medium"
                      style={{ color: COLOR_OXFORD_BLUE }}
                    >
                      First Name
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="Jaylon"
                      className="h-[34px] mt-1 text-black"
                      style={{
                        borderColor: COLOR_LIGHT_SILVER,
                        fontSize: "14px",
                      }}
                      value={values.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {renderError("first_name")}
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label
                      htmlFor="last_name"
                      className="text-[14px] font-medium"
                      style={{ color: COLOR_OXFORD_BLUE }}
                    >
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Dorwat"
                      className="h-[34px] mt-1 text-black"
                      style={{
                        borderColor: COLOR_LIGHT_SILVER,
                        fontSize: "14px",
                      }}
                      value={values.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {renderError("last_name")}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-[14px] font-medium"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="jaylon.dorwart@bliss.com"
                    className="h-[34px] mt-1 text-black"
                    style={{
                      borderColor: COLOR_LIGHT_SILVER,
                      fontSize: "14px",
                    }}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {renderError("email")}
                </div>

                {/* phone_number */}
                <div>
                  <Label
                    htmlFor="phone_number"
                    className="text-[14px] font-medium"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    phone_number Number
                  </Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="h-[34px] mt-1 text-black"
                    style={{
                      borderColor: COLOR_LIGHT_SILVER,
                      fontSize: "14px",
                    }}
                    value={values.phone_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {renderError("phone_number")}
                </div>

                {/* Company */}
                <div>
                  <Label
                    htmlFor="company"
                    className="text-[14px] font-medium"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Bliss Property Management"
                    className="h-[34px] mt-1 text-black"
                    style={{
                      borderColor: COLOR_LIGHT_SILVER,
                      fontSize: "14px",
                    }}
                    value={values.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {renderError("company")}
                </div>

                {/* Job Title */}
                <div>
                  <Label
                    htmlFor="job_title"
                    className="text-[14px] font-medium"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Job Title
                  </Label>
                  <Input
                    id="job_title"
                    name="job_title"
                    placeholder="Add job title"
                    className="h-[34px] mt-1 text-black"
                    style={{
                      borderColor: COLOR_LIGHT_SILVER,
                      fontSize: "14px",
                    }}
                    value={values.job_title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {renderError("job_title")}
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-center sm:justify-start pt-4 lg:items-start lg:self-start">
                <Button
                  type="submit"
                  className="btn text-[14px] w-full sm:w-auto min-w-[120px]"
                  disabled={isSubmitting || updateProfileMutation.isPending}
                >
                  <TbDeviceFloppy className="mr-2" size={16} />
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Card – Company Logo (Optional) */}
          <Card
            className="w-full h-fit lg:w-1/3 p-[24px] border-1"
            style={{ borderColor: COLOR_ATHENS_GRAY }}
          >
            <CardHeader className="p-0">
              <CardTitle
                className="text-[18px] gap-2 flex items-center font-bold"
                style={{ color: COLOR_EBONY }}
              >
                <TbBuilding size={20} />
                Company Logo
              </CardTitle>
              <CardDescription
                className="text-[14px]"
                style={{ color: COLOR_PALE_SKY }}
              >
                {values.company_logo_url
                  ? "Your company's logo"
                  : "Upload your company logo (optional)"}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {values.company_logo_url ? (
                <div className="flex flex-col items-start">
                  <img
                    src={values.company_logo_url}
                    alt="Company Logo"
                    className="w-40 h-40 object-cover rounded-md shadow"
                    style={{ borderColor: COLOR_ATHENS_GRAY }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setFieldValue("company_logo_url", "")}
                    className="mt-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Remove Logo
                  </Button>
                </div>
              ) : (
                <>
                  <DropzoneUploader
                    showLabel={false}
                    onFilesSelected={async (files) => {
                      // Save raw files for local preview
                      setFieldValue("_localFiles", files);
                    }}
                    borderColor={COLOR_BLUE}
                    backgroundColor={COLOR_LIGHT_BLUE}
                    height={"100px"}
                  />
                  <p
                    className="text-[12px] text-gray-500 mt-[16px] text-center"
                    style={{ color: COLOR_PALE_SKY }}
                  >
                    Recommended: 200x200px, PNG or JPG
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </fieldset>
      </form>
    </div>
  );
};

export default ProfileTab;
