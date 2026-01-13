import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";
import Images from "@/lib/images";

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 animate-fade-in-up">
      <div className="hidden bg-muted lg:block relative h-full">
         <img
           src={Images.loginBackground}
           alt="Login Background"
           className="h-full w-full object-cover"
         />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <AuthForm mode="login" />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline hover:text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
