import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-lg space-y-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Start managing your restaurant today
          </p>
        </div>

        <AuthForm mode="register" />

        <div className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
