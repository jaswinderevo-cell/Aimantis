import {
  COLOR_ATHENS_GRAY,
  COLOR_LIGHT_MISCHKA,
  COLOR_OXFORD_BLUE,
  COLOR_ROYAL_BLUE,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { useLogin } from "@/services/auth";
import { handleEnterSubmit } from "@/utils/helper";
import { getIn, useFormik } from "formik";
import { Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { TbEye, TbEyeOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

export function LoginForm() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { mutateAsync: login, isPending } = useLogin();
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Please enter your email")
      .max(70, "Maximum length is 70 characters.")
      .min(5, "Need at least 5 characters."),
    password: Yup.string().required("Password required"),
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    dirty,
    errors,
    touched,
    isValid,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setLoading(true);
      login(values)
        .then(() => {
          resetForm();
        })
        .catch((error) => {
          console.error("API Response Error", error);
        })
        .finally(() => {
          setSubmitting(false);
          setLoading(false);
        });
    },
  });

  const navigate = useNavigate();

  const handleForgotPassForm = () => {
    navigate(ROUTES.FORGOT_PASSWORD);
  };

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

  //for showing loader until image loads
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = "/aimantis-logo.svg";
    img.onload = () => setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[16px] shadow-2xl overflow-hidden">
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
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-8 pt-[52.14px]">
              <div className="text-center">
                <h1 className="text-[30px] font-bold text-gray-900 mb-[8px]">
                  Welcome Back
                </h1>
                <p
                  className="text-[13.89px]"
                  style={{ color: COLOR_OXFORD_BLUE }}
                >
                  Sign in to your property management account
                </p>
              </div>

              <div className="space-y-[24px] mt-[31px]">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[13.89px] font-medium mb-2"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 top-3 flex pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={values.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onKeyDown={(e) =>
                        handleEnterSubmit(e, isValid, handleSubmit)
                      }
                      className="w-full pl-10 pr-3 py-3 h-[42px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 placeholder-gray-500"
                      placeholder="Enter your email"
                      required
                      style={{ borderColor: COLOR_LIGHT_MISCHKA }}
                    />
                    {touched.email && errors.email && (
                      <span className="text-start text-red-500 text-[12px]">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[13.89px] font-medium mb-2"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>

                    {isShowPassword ? (
                      <>
                        <div
                          className="absolute top-3 right-2 pl-3 text-black cursor-pointer"
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
                          className="absolute top-3 right-2 pl-3 text-black cursor-pointer"
                          onClick={() =>
                            setIsShowPassword((prev) => (prev = !prev))
                          }
                        >
                          <TbEye
                            size={20}
                            className="hover:bg-gray-100 rounded-md"
                          />
                        </div>
                      </>
                    )}
                    <input
                      type={`${isShowPassword ? "text" : "password"}`}
                      autoComplete="new-password"
                      id="password"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 h-[42px] border border-gray-300 rounded-[8px] placeholder-gray-500"
                      placeholder="Enter your password"
                      required
                      style={{ borderColor: COLOR_LIGHT_MISCHKA }}
                    />
                    {renderError("password")}
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-blue-600 rounded-[8px]"
                      style={{ borderColor: COLOR_OXFORD_BLUE }}
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-[14px]"
                      style={{ color: COLOR_OXFORD_BLUE }}
                    >
                      Remember me for 30 days
                    </label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <a
                    href="#"
                    className="text-[14px] hover:underline font-medium"
                    onClick={handleForgotPassForm}
                    style={{ color: COLOR_ROYAL_BLUE }}
                  >
                    Forgot your password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isPending || !isValid}
                  className={`w-full text-[14px] font-bold text-white py-3 px-4 rounded-lg
                  ${isPending || !isValid || !dirty ? "bg-gray-400 cursor-not-allowed"
      : "bg-[#2563EB] hover:bg-[#1D4ED8]"}`}>
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                {/* Divider */}
                <div className="relative m-0 p-0">
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className="w-full border-t"
                      style={{ borderColor: COLOR_ATHENS_GRAY }}
                    ></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span
                      className="px-2 bg-white"
                      style={{ color: COLOR_OXFORD_BLUE }}
                    >
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 mt-[24px] py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>

                {/* Sign Up Link */}
                <div
                  className="text-center flex justify-center items-center pt-1 h-[46px] border-t-1 mt-[26px] mb-[70px]"
                  style={{ borderColor: COLOR_ATHENS_GRAY }}
                >
                  <span className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <Link
                      to={ROUTES.SIGNUP}
                      className="hover:underline font-medium"
                      style={{ color: COLOR_ROYAL_BLUE }}
                    >
                      Sign up for free
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
