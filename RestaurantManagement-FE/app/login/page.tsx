import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/forms/auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your dashboard
          </p>
        </div>

        <AuthForm mode="login" />

        <div className="text-center text-sm text-slate-500">
          Not a member?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
