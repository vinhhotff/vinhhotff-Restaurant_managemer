"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import { useAuth } from "@/contexts/AuthContext";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Họ tên ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(8, "Số điện thoại ít nhất 8 ký tự"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu"),
    terms: z.boolean().refine((v) => v === true, { message: "Bạn cần đồng ý Điều khoản & Chính sách" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không trùng khớp",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof registerSchema>;

const inputClass =
  "block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gourmet-primary sm:text-sm dark:bg-gourmet-input dark:text-white dark:ring-gourmet-border dark:placeholder:text-[#b9b29d] dark:focus:ring-gourmet-primary";
const inputClassNoPl =
  "block w-full rounded-lg border-0 py-3 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gourmet-primary sm:text-sm dark:bg-gourmet-input dark:text-white dark:ring-gourmet-border dark:placeholder:text-[#b9b29d] dark:focus:ring-gourmet-primary";

export default function RegisterPage() {
  const router = useRouter();
  const { setUserFromEmail } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      await api.post("/auth/register", {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      await setUserFromEmail(data.email);
      router.push("/");
    } catch (e) {
      if (isAxiosError(e)) {
        const msg = e.response?.data?.message ?? e.response?.data?.error ?? "Đăng ký thất bại.";
        setServerError(typeof msg === "string" ? msg : "Đăng ký thất bại.");
      } else {
        setServerError("Đăng ký thất bại. Kiểm tra kết nối Backend (CORS, URL).");
      }
    }
  });

  return (
    <div className="flex min-h-screen w-full flex-row font-display text-white overflow-hidden bg-[#f8f8f6] dark:bg-gourmet-bg-dark">
      {/* Left Panel: Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-12 bg-gourmet-surface overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-gourmet-bg-dark via-gourmet-bg-dark/80 to-transparent" />
        <div className="relative z-20 flex flex-col max-w-lg mb-10">
          <div className="mb-8 flex items-center gap-3">
            <span className="text-gourmet-primary text-4xl">🍽</span>
            <span className="text-2xl font-bold tracking-tight text-white">GourmetOS</span>
          </div>
          <h1 className="text-white tracking-tight text-5xl font-bold leading-tight mb-6">
            Elevate Your Dining Experience
          </h1>
          <p className="text-gray-300 text-lg font-normal leading-relaxed">
            Join thousands of restaurateurs managing their business with precision. From table reservations to inventory tracking, we power the world&apos;s finest kitchens.
          </p>
          <div className="mt-8 flex gap-4 items-center">
            <div className="flex -space-x-3 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-gourmet-bg-dark bg-gourmet-border"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5 text-gourmet-primary">
                {"★".repeat(5)}
              </div>
              <span className="text-sm text-gray-400">Loved by top chefs globally</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex w-full lg:w-1/2 flex-col bg-[#f8f8f6] dark:bg-gourmet-bg-dark overflow-y-auto">
        <div className="flex min-h-full flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Start your 30-day free trial. No credit card required.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Full Name - khớp Backend: fullName */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                  Full Name
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-[20px]">👤</span>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className={inputClass}
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email - khớp Backend: email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                  Email Address
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-[20px]">✉</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="chef@restaurant.com"
                    className={inputClass}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Phone - khớp Backend: phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                  Phone Number
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-[20px]">📞</span>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+84 (555) 000-0000"
                    className={inputClass}
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Password + Confirm - khớp Backend: password (min 6) */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                    Password
                  </label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={inputClassNoPl}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                    Confirm Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className={inputClassNoPl}
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-gourmet-primary focus:ring-gourmet-primary dark:border-gourmet-border dark:bg-gourmet-input dark:checked:bg-gourmet-primary"
                    {...register("terms")}
                  />
                </div>
                <label htmlFor="terms" className="ml-3 text-sm leading-6 text-gray-900 dark:text-white">
                  Tôi đồng ý với{" "}
                  <a href="#" className="font-semibold text-gourmet-primary hover:opacity-80">Điều khoản</a>
                  {" "}&amp;{" "}
                  <a href="#" className="font-semibold text-gourmet-primary hover:opacity-80">Chính sách bảo mật</a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-500">{errors.terms.message}</p>
              )}

              {serverError && (
                <p className="text-sm text-red-500" role="alert">{serverError}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-lg bg-gourmet-primary px-3 py-4 text-sm font-bold leading-6 text-black shadow-sm hover:bg-gourmet-primary/90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gourmet-primary disabled:opacity-50 transition-colors duration-200"
                >
                  {isSubmitting ? "Đang xử lý…" : "Create Account"}
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200 dark:border-gourmet-border" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-[#f8f8f6] dark:bg-gourmet-bg-dark px-6 text-gray-900 dark:text-white">
                    Already have an account?
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <Link
                  href={"/login" as import("next").Route}
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-gourmet-surface/50 px-3 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gourmet-border hover:bg-gourmet-surface transition-colors duration-200"
                >
                  <span className="text-gourmet-primary">Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
