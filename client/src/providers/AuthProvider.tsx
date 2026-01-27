"use client";

import { useEffect } from "react";

import { hasAccessToken } from "@/lib/actions/auth";
import { getUser } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setIsLoading } = useAuthStore();

    useEffect(() => {
        async function initAuth() {
            try {
                const hasToken = await hasAccessToken();

                // 쿠키에 access token이 있다면 사용자 정보를 가져와서 저장한다.
                if (hasToken) {
                    const response = await getUser();
                    setUser(response.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        initAuth();
    }, [setUser, setIsLoading]);

    return <>{children}</>;
}
