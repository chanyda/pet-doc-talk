"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ArrowDownIcon from "public/icons/arrow-down-icon.svg";
import ArrowUpIcon from "public/icons/arrow-up-icon.svg";
import LogoutIcon from "public/icons/logout-icon.svg";
import ProfileIcon from "public/icons/profile-icon.svg";
import { useState } from "react";

import { useOutsideClick } from "@/hooks/useClickOutside";
import * as api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

import { ProfileAvatar } from "../ui/ProfileAvatar";

interface Tab {
    id: string;
    label: string;
    href: string;
}

export function TopNavigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useOutsideClick(() => setIsMenuOpen(false));

    const tabs: Tab[] = [
        { id: "home", label: "홈", href: "/" },
        { id: "community", label: "커뮤니티", href: "/community" },
        { id: "ai", label: "AI 상담", href: "/ai" },
    ];

    const handleLogout = async () => {
        try {
            await api.logout();
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
                        {isAuthenticated && user ? (
                            <div className="relative ml-3" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen((prev) => !prev)}
                                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white transition-all">
                                    <ProfileAvatar nickname={user.nickname} size="sm" />
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-16">
                                        {user.nickname}
                                    </span>
                                    {isMenuOpen ? <ArrowUpIcon fill={"#505050"} /> : <ArrowDownIcon fill={"#505050"} />}
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30 animate-in fade-in slide-in-from-top-1">
                                        <div className="px-4 py-2.5 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate max-w-16">
                                                {user.nickname}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href="/mypage"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                <ProfileIcon />
                                                마이페이지
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                                <LogoutIcon stroke="#e7000b" />
                                                로그아웃
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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
