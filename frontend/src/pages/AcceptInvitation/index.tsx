import { Loader } from "@/common/components/loader/Loader";
import { Input } from "@/components/ui/Input";
import {
  COLOR_ATHENS_GRAY,
  COLOR_LIGHT_MISCHKA,
  COLOR_LIGHT_SILVER,
  COLOR_OXFORD_BLUE,
  COLOR_ROYAL_BLUE,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { AcceptInvitationSchema } from "@/schemas/acceptInvitationSchema";
import {
  AcceptInvitationPayload,
  useAcceptInvitation,
  useGetInvitaionById,
} from "@/services/structureUsers";
import { getIn, useFormik } from "formik";
import { Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import {
  TbBuildingEstate,
  TbEye,
  TbEyeOff,
  TbLock,
  TbUserCheck,
} from "react-icons/tb";
import PasswordStrengthBar from "react-password-strength-bar";
import { Link, useNavigate, useParams } from "react-router-dom";

const AcceptInvitaion = () => {
  const { invitation_id } = useParams();

  //get invitation by id
  const getInvitationById = useGetInvitaionById(String(invitation_id));
  const data = getInvitationById?.data?.data || {};

  //accept invitation mutation
  const acceptInvitaionMutation = useAcceptInvitation();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    handleChange,
    resetForm,
    handleBlur,
    values,
    dirty,
    errors,
    touched,
    isSubmitting,
    isValid,
  } = useFormik<AcceptInvitationPayload>({
    initialValues: {
      invitation_id: invitation_id ? invitation_id : null,
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
      agreedToTerms: false,
      receiveUpdates: false,
    },
    validationSchema: AcceptInvitationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values);
      setSubmitting(true);
      const { agreedToTerms, receiveUpdates, ...apiPayload } = values;
      acceptInvitaionMutation.mutate(apiPayload, {
        onSuccess: () => {
          resetForm();
          setSubmitting(false);
          navigate(ROUTES.LOGIN);
        },
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  });

  //for showing loader until image loads
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = "/aimantis-logo.svg";
    img.onload = () => setIsLoaded(true);
  }, []);

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

  if (getInvitationById?.isLoading)
    return (
      <>
        <div>
          <Loader />
        </div>
      </>
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <Link to={ROUTES.LANDING_PAGE}>
              <div className="h-[130px] w-full max-w-[367px] mt-7 mx-auto rounded-xl">
                {!isLoaded ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                  <div
                    className="w-full h-full bg-no-repeat bg-cover bg-center rounded-xl"
                    style={{ backgroundImage: "url('/aimantis-logo.svg')" }}
                  ></div>
                )}
              </div>
            </Link>

            {/* form */}
            <form onSubmit={handleSubmit}>
              <div className="px-8 pt-6 pb-8">
                {/* main text */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Welcome to Aimantis
                  </h1>
                  <p className="text-sm text-gray-500">
                    Review your invitation details below
                  </p>
                </div>

                {/* Readonly Invitation Info */}
                <div className="space-y-4">
                  {/* structure & role */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <TbBuildingEstate className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Structure</div>
                          <div className="text-sm font-medium text-gray-800">
                            {data?.structure_name || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <TbUserCheck className="h-5 w-5 text-gray-500" />
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Role</div>
                          <div className="text-sm font-medium text-gray-800">
                            {data?.role || "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1 text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        readOnly
                        id="email"
                        value={data?.email || ""}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-8 border-t border-gray-200" />

                {/* Password Setup Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Set Your Credentials
                  </h2>

                  {/* username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium mb-1 text-gray-700"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        placeholder="Set username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pl-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                      />
                      {renderError("username")}
                    </div>
                  </div>

                  {/* first name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="text-[14px] font-medium"
                        style={{ color: COLOR_OXFORD_BLUE }}
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        placeholder="John"
                        value={values.first_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-3 mt-1 h-[42px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
                        style={{
                          fontSize: "14px",
                          borderColor: COLOR_LIGHT_SILVER,
                        }}
                      />
                      {renderError("first_name")}
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="text-[14px] font-medium"
                        style={{ color: COLOR_OXFORD_BLUE }}
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Doe"
                        value={values.last_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="text-black w-full mt-1 h-[42px] px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                        style={{
                          fontSize: "14px",
                          borderColor: COLOR_LIGHT_SILVER,
                        }}
                      />
                      {renderError("last_name")}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="text-[14px] font-medium"
                      style={{ color: COLOR_OXFORD_BLUE }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>

                      {isShowPassword ? (
                        <>
                          <div
                            className="absolute inset-y-0 right-2 pl-3 flex items-center text-black cursor-pointer"
                            onClick={() =>
                              setIsShowPassword((prev) => (prev = !prev))
                            }
                          >
                            <TbEyeOff
                              size={20}
                              className="hover:bg-gray-100 rounded-md"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className="absolute inset-y-0 right-2 pl-3 flex items-center text-black cursor-pointer"
                            onClick={() =>
                              setIsShowPassword((prev) => (prev = !prev))
                            }
                          >
                            <TbEye
                              size={20}
                              className="hover:bg-gray-100 rounded-md text-gray-400"
                            />
                          </div>
                        </>
                      )}
                      <input
                        type={`${isShowPassword ? "text" : "password"}`}
                        autoComplete="new-password"
                        placeholder="Enter password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                      />
                    </div>
                    {/* Show password strength bar */}
                    {values.password && (
                      <div className="mt-2">
                        <PasswordStrengthBar
                          className="custom-password-bar"
                          scoreWords={[
                            "Password strength: Weak",
                            "Password strength: Fair",
                            "Password strength: Good",
                            "Password strength: Strong",
                            "Password strength: Very Strong",
                          ]}
                          minLength={6}
                          shortScoreWord="Password strength: Too Short"
                          password={values.password}
                        />
                      </div>
                    )}
                    {renderError("password")}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <label
                      htmlFor="confirm_password"
                      className="block text-sm font-medium mb-1 text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <TbLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type={isShowPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        name="confirm_password"
                        value={values.confirm_password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                      />
                      <div
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                        onClick={() => setIsShowPassword(!isShowPassword)}
                      >
                        {isShowPassword ? (
                          <TbEyeOff size={20} />
                        ) : (
                          <TbEye size={20} />
                        )}
                      </div>
                    </div>
                    {renderError("confirm_password")}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mt-5">
                      <input
                        type="checkbox"
                        id="agreedToTerms"
                        name="agreedToTerms"
                        checked={values.agreedToTerms}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 cursor-pointer focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="agreedToTerms"
                        className="text-[14px]"
                        style={{ color: COLOR_OXFORD_BLUE }}
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="hover:underline"
                          style={{ color: COLOR_ROYAL_BLUE }}
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="hover:underline"
                          style={{ color: COLOR_ROYAL_BLUE }}
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    {renderError("agreedToTerms")}

                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="receiveUpdates"
                        name="receiveUpdates"
                        checked={values.receiveUpdates}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 mt-0.5 cursor-pointer focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="receiveUpdates"
                        className="text-[14px]"
                        style={{ color: COLOR_OXFORD_BLUE }}
                      >
                        I would like to receive product updates and marketing
                        communications
                      </label>
                    </div>
                    {renderError("receiveUpdates")}
                  </div>

                  {/* submit button */}
                  <button
                    type="submit"
                    disabled={acceptInvitaionMutation.isPending || !isValid}
                    className={`w-full text-[14px] font-bold text-white py-3 px-4 rounded-lg
            ${
    acceptInvitaionMutation.isPending || !isValid || !dirty
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-[#2563EB] hover:bg-[#1D4ED8]"
    }`}
                  >
                    {acceptInvitaionMutation.isPending
                      ? "Creating"
                      : "Create account"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcceptInvitaion;
