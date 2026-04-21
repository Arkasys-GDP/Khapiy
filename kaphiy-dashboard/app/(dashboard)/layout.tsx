"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { TopBar } from "@/src/shared/ui/TopBar";
import { StatsBar } from "@/src/shared/ui/StatsBar";
import { useAuthStore } from "@/src/features/auth/store/authSlice";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopBar />
      <StatsBar />
      {children}
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          classNames: {
            toast: "font-sans text-sm",
          },
        }}
      />
    </div>
  );
}
