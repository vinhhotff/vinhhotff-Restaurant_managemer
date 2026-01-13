"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";

const loginSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginInput = z.infer<typeof loginSchema>;

const registerSchema = loginSchema
  .extend({
    fullName: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters" }),
    phone: z
      .string()
      .min(8, { message: "Phone number must be at least 8 digits" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterInput = z.infer<typeof registerSchema>;

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isRegister = mode === "register";

  const form = useForm<LoginInput | RegisterInput>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: isRegister
      ? {
          email: "",
          password: "",
          fullName: "",
          phone: "",
          confirmPassword: "",
        }
      : {
          email: "",
          password: "",
        },
  });

  const { handleSubmit, register, formState } = form;
  const errors = formState.errors as Partial<
    Record<string, { message?: string }>
  >;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    setSuccess(null);

    try {
      if (isRegister) {
        const registerPayload = {
          email: values.email,
          password: values.password,
          fullName: (values as RegisterInput).fullName,
          phone: (values as RegisterInput).phone,
        };

        await api.post("/auth/register", registerPayload);
        setSuccess("Registration successful. Redirecting to dashboard...");
      } else {
        const loginPayload = {
          email: values.email,
          password: values.password,
        };

        await api.post("/auth/login", loginPayload);
        setSuccess("Login successful. Redirecting...");
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Unable to complete request";
        setServerError(message);
        return;
      }

      setServerError("Unexpected error. Please try again.");
    }
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      {isRegister && (
        <InputField
          label="Full name"
          placeholder="Jane Doe"
          {...register("fullName")}
          error={errors.fullName?.message}
        />
      )}

      <InputField
        label="Email"
        type="email"
        placeholder="jane@example.com"
        {...register("email")}
        error={errors.email?.message}
      />

      {isRegister && (
        <InputField
          label="Phone"
          placeholder="0123456789"
          {...register("phone")}
          error={errors.phone?.message}
        />
      )}

      <InputField
        label="Password"
        type="password"
        placeholder="••••••••"
        {...register("password")}
        error={errors.password?.message}
      />

      {isRegister && (
        <InputField
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      )}

      {serverError && <p className="text-sm text-red-400">{serverError}</p>}
      {success && <p className="text-sm text-green-400">{success}</p>}

      <Button type="submit" isLoading={formState.isSubmitting}>
        {isRegister ? "Create account" : "Login"}
      </Button>
    </form>
  );
}
