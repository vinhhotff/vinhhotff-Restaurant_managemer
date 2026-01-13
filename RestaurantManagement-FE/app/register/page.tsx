import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/forms/auth-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 animate-fade-in-up">
      <Card className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start managing your restaurant today
          </p>
        </div>

        <AuthForm mode="register" />

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
}
