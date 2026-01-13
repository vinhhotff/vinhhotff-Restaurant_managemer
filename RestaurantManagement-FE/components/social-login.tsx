"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export function SocialLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    popupRef.current = null;
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, []);

  const handleGoogleLogin = () => {
    // Prevent multiple popups
    if (isLoading) return;

    setIsLoading(true);

    // Calculate center position for the popup
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Open popup to Backend Google Auth URL
    // Backend redirects to Google -> Google redirects to Backend Callback -> Backend returns JSON
    // We poll to detect when cookies are set.
    const url = "http://localhost:8080/auth/google/login";
    popupRef.current = window.open(
      url,
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Polling mechanism
    timerRef.current = setInterval(async () => {
      try {
        if (popupRef.current?.closed) {
          cleanUp();
          return;
        }

        // Check if we are authenticated by hitting a protected endpoint
        // api uses "/api" prefix which proxies to localhost:8080
        // We use check a lightweight endpoint or just try to get something.
        // Assuming "/users" exists and requires auth (or even if it doesn't, if cookies are set we are good?)
        // Actually, we need to know if the NEW cookies are set.
        // If we were already logged in, this might give false positive?
        // Ideally we check if user changed. But simplified: check if call succeeds.
        
        // Use a lightweight call. /auth/refresh might be good but it creates new tokens.
        // Let's try /api/users. Even if it fails with 403, it means we reached backend.
        // If 401, we are not logged in.
        
        const response = await api.get("/users").catch((err) => {
            // If 403, it means we are authenticated but maybe not authorized (depending on role), 
            // but effectively logged in.
            // If 401, not logged in.
            return err.response;
        });

        if (response && response.status !== 401) {
             // Successful login!
             // Proceed to dashboard
             cleanUp();
             router.push("/dashboard");
        }

      } catch (error) {
        // Ignore errors during polling
      }
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col gap-4">
       <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button 
        variant="outline" 
        onClick={handleGoogleLogin}
        isLoading={isLoading}
        className="w-full flex items-center gap-2"
        type="button"
      >
        <FaGoogle className="h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
