"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

interface Tab {
    id: string;
    label: string;
    href: string;
}

export function TopNavigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, logout } = useAuthStore();

    const tabs: Tab[] = [
        { id: "home", label: "홈", href: "/" },
        { id: "community", label: "커뮤니티", href: "/community" },
        { id: "ai", label: "AI 상담", href: "/ai" },
    ];

    const handleLogout = async () => {
        try {
            logout();

            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center">
                        <h1 className="text-xl" style={{ color: "#FF6B9D" }}>
                            🐾 펫케어
                        </h1>
                    </Link>
                    <div className="flex items-center gap-1">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-50"
                                    style={{ color: isActive ? "#FF6B9D" : "#6B7280" }}>
                                    <span className="text-sm">{tab.label}</span>
                                </Link>
                            );
                        })}
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-50 ml-2"
                                style={{ color: "#6B7280" }}>
                                <span className="text-sm">로그아웃</span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-50 ml-2"
                                style={{
                                    color: pathname === "/login" ? "#FF6B9D" : "#6B7280",
                                }}>
                                <span className="text-sm">로그인</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
