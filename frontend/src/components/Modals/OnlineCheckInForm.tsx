import React, { useEffect, useState } from "react";
import { getIn, useFormik } from "formik";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import "@/styles/signup.css";

import { SignupSchema } from "@/schemas/signupFormSchema";
import {
  COLOR_ATHENS_GRAY,
  COLOR_EBONY,
  COLOR_LIGHT_GRAY,
  COLOR_LIGHT_SILVER,
  COLOR_OXFORD_BLUE,
  COLOR_ROYAL_BLUE,
} from "@/constants/constants";
import PasswordStrengthBar from "react-password-strength-bar";
import { Mail } from "lucide-react";
import { TbEye, TbEyeOff } from "react-icons/tb";
import { SignUpPayload, useSignup } from "@/services/auth";

const SignupForm: React.FC = () => {
  const signupMutation = useSignup();

  const formik = useFormik<SignUpPayload>({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      company: "",
      phone_number: "",
      property_count: 1,
      password: "",
      confirm_password: "",
      agreedToTerms: false,
      receiveUpdates: false,
    },
    validationSchema: SignupSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      signupMutation.mutate(values, {
        onSuccess: () => {
          formik.resetForm();
          setSubmitting(false);
        },
      });
    },
  });

  const [isShowPassword, setIsShowPassword] = useState(false);

  //for showing loader until image loads
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = "/aimantis-logo.svg";
    img.onload = () => setIsLoaded(true);
  }, []);

  const renderError = (field: string) => {
    const error = getIn(formik.errors, field);
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
    <div className="min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] shadow-lg p-8 w-full max-w-md">
        <div className="text-center ">
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
          <h1
            className="text-[30px] font-bold mt-[47.4px] mb-[8px]"
            style={{ color: COLOR_EBONY }}
          >
            Create Account
          </h1>
          <p className="text-[13.89px]" style={{ color: COLOR_OXFORD_BLUE }}>
            Start managing your properties with AIMANTIS
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="space-y-[15px] mt-[30px]"
        >
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
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 mt-1 h-[42px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontSize: "14px", borderColor: COLOR_LIGHT_SILVER }}
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
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="text-black w-full mt-1 h-[42px] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: "14px", borderColor: COLOR_LIGHT_SILVER }}
              />
              {renderError("last_name")}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-[14px] font-medium"
              style={{ color: COLOR_OXFORD_BLUE }}
            >
              Email Address
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="text-black w-full h-[42px] px-3 ps-10 pe-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: "14px", borderColor: COLOR_LIGHT_SILVER }}
              />
            </div>
            {renderError("email")}
          </div>

          <div>
            <label
              htmlFor="company"
              className="text-[14px] font-medium"
              style={{ color: COLOR_OXFORD_BLUE }}
            >
              Company Name
            </label>

            <div className="relative mt-1">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="company"
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="text-black w-full h-[42px] px-3 ps-10 pe-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: "14px", borderColor: COLOR_LIGHT_SILVER }}
              />
            </div>
            {renderError("company")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone_number"
                className="text-[14px] font-medium"
                style={{ color: COLOR_OXFORD_BLUE }}
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="text-black w-full mt-1 px-3 h-[42px] py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: "14px", borderColor: COLOR_LIGHT_SILVER }}
              />
              {renderError("phone_number")}
            </div>
            <div>
              <label
                htmlFor="property_count"
                className="text-[14px] font-medium"
                style={{ color: COLOR_OXFORD_BLUE }}
              >
                Property Count
              </label>
              <input
                type="number"
                name="property_count"
                value={formik.values.property_count}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="text-black w-full mt-1 h-[42px] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: "14px", borderColor: COLOR_LIGHT_SILVER }}
              />
              {renderError("property_count")}
            </div>
          </div>

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
                    onClick={() => setIsShowPassword((prev) => (prev = !prev))}
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
                    onClick={() => setIsShowPassword((prev) => (prev = !prev))}
                  >
                    <TbEye size={20} className="hover:bg-gray-100 rounded-md" />
                  </div>
                </>
              )}
              <input
                type={`${isShowPassword ? "text" : "password"}`}
                autoComplete="new-password"
                placeholder="Enter password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="text-black w-full mt-1 px-3 ps-10 pe-2 h-[42px] border rounded-lg"
                style={{ fontSize: "14px", borderColor: COLOR_LIGHT_SILVER }}
              />
            </div>
            {/* Show password strength bar */}
            {formik.values.password && (
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
                  password={formik.values.password}
                />
              </div>
            )}
            {renderError("password")}
          </div>

          <div>
            <label
              htmlFor="confirm_password"
              className="text-[14px] font-medium"
              style={{ color: COLOR_OXFORD_BLUE }}
            >
              Confirm Password
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
              <input
                type="password"
                name="confirm_password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Confirm your password"
                className="text-black w-full mt-1 px-3 ps-10 pe-2 h-[42px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: "14px", borderColor: COLOR_LIGHT_SILVER }}
              />
            </div>
            {renderError("confirm_password")}
          </div>
          <div>
            <div className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                checked={formik.values.agreedToTerms}
                onChange={formik.handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="receiveUpdates"
                name="receiveUpdates"
                checked={formik.values.receiveUpdates}
                onChange={formik.handleChange}
                className="h-4 w-4 text-blue-600 mt-0.5 focus:ring-blue-500 border-gray-300 rounded"
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
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending || !formik.isValid}
            className={`w-full text-[14px] font-bold text-white py-3 px-4 rounded-lg
            ${
    signupMutation.isPending || !formik.isValid || !formik.dirty
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-[#2563EB] hover:bg-[#1D4ED8]"
    }`}
          >
            {signupMutation.isPending ? "Creating..." : "Create Account"}
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
          <button
            type="button"
            className="w-full mt-[23px] bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center text-[14px] font-bold"
            style={{ color: COLOR_OXFORD_BLUE }}
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
        </form>

        <div
          className="text-center flex justify-center items-center pt-1 h-[46px] border-t-1 mt-[26px] mb-[50px]"
          style={{ borderColor: COLOR_ATHENS_GRAY }}
        >
          <p className="text-[14px]" style={{ color: COLOR_LIGHT_GRAY }}>
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="text-[14px] hover:underline font-medium"
              style={{ color: COLOR_ROYAL_BLUE }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
