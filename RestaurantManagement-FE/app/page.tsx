import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaUtensils, FaCalendarAlt, FaUsers } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 w-full animate-fade-in-up">
      {/* Hero Section */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center py-12">
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20">
            v2.0 Now Available
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Manage your restaurant <br /> like a pro.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            The all-in-one platform for modern restaurant management. Handle reservations, staff, and operations with ease and style.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="rounded-full shadow-primary/25 shadow-xl">Login to Dashboard</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="rounded-full bg-background/50 backdrop-blur">Create Account</Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto w-full px-4">
        <Card className="hover:scale-105 duration-300 border-primary/20">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <FaUtensils className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Operations</h3>
          <p className="text-muted-foreground">Streamline your daily kitchen and floor operations with real-time tracking.</p>
        </Card>
        <Card className="hover:scale-105 duration-300 border-secondary/20 bg-secondary/10">
          <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
            <FaCalendarAlt className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Reservations</h3>
          <p className="text-muted-foreground">Smart booking system to maximize seating efficiency and reduce no-shows.</p>
        </Card>
        <Card className="hover:scale-105 duration-300 border-pink-500/20 bg-pink-500/5">
          <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
            <FaUsers className="h-6 w-6 text-pink-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Staffing</h3>
          <p className="text-muted-foreground">Manage shifts, payroll, and performance all in one place.</p>
        </Card>
      </section>
    </div>
  );
}
