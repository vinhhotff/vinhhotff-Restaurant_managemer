import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";
import Images from "@/lib/images";

export default function RegisterPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 animate-fade-in-up">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
              Create an account to manage your restaurant
            </p>
          </div>
          <AuthForm mode="register" />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative h-full">
         <img
           src={Images.registerBackground}
           alt="Register Background"
           className="h-full w-full object-cover"
         />
      </div>
    </div>
  );
}
