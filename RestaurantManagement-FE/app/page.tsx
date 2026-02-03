import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center gap-4">
      <h1 className="text-2xl font-semibold text-foreground">
        Restaurant Management
      </h1>
      <p className="mt-2 text-muted-foreground">
        Đang cập nhật giao diện mới.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="text-primary hover:underline font-medium">
          Đăng nhập
        </Link>
        <Link href="/register" className="text-primary hover:underline font-medium">
          Đăng ký
        </Link>
      </div>
    </div>
  );
}
