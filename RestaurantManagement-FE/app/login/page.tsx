import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/forms/auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 animate-fade-in-up">
      <Card className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        <AuthForm mode="login" />

        <div className="text-center text-sm text-muted-foreground">
          Not a member?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
}
