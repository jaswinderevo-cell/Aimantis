import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import logo from '../assets/imgs/logo.png';
import { Loader } from '../common/components/loader/Loader';
import { useForgotPassword } from '@/services/auth';
import { ROUTES } from '@/constants/routes';

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [loading, setLoading] = useState(false);
  const { mutateAsync: forgotPassword } = useForgotPassword();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Please enter your email')
      .max(70, 'Maximum length is 70 characters.')
      .min(5, 'Need at least 5 characters.'),
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    isValid,
  } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setLoading(true);
      forgotPassword(values.email)
        .then(() => {
          resetForm();
        })
        .catch((error) => {
          console.error('API Response Error', error);
        })
        .finally(() => {
          setSubmitting(false);
          setLoading(false);
        });
    },
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (isValid) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          {loading && <Loader />}

          <Link to={ROUTES.LANDING_PAGE}>
            <img src={logo} alt="Logo" width={250} style={{ margin: 'auto' }} />
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                Enter your email below to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                    />
                    {touched.email && errors.email && (
                      <span className="text-start text-red-500 text-sm">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !isValid}
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
