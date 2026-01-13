import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-10 backdrop-blur">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-100">Welcome back</h1>
        <p className="max-w-2xl text-slate-400">
          Use the authentication portal to manage restaurant reservations and
          staffing tools. Create an account or sign in to continue.
        </p>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href="/login"
          className="rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground"
        >
          Login to dashboard
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-primary px-5 py-3 font-medium text-primary"
        >
          Create new account
        </Link>
      </div>
    </section>
  );
}
