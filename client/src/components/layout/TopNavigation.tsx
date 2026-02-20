"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ArrowDownIcon from "public/icons/arrow-down-icon.svg";
import ArrowUpIcon from "public/icons/arrow-up-icon.svg";
import CancelIcon from "public/icons/cancel-icon.svg";
import LogoutIcon from "public/icons/logout-icon.svg";
import MenuIcon from "public/icons/menu-icon.svg";
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
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const profileMenuRef = useOutsideClick(() => setIsProfileMenuOpen(false));

    const tabs: Tab[] = [
        { id: "home", label: "홈", href: "/" },
        { id: "community", label: "커뮤니티", href: "/community" },
        { id: "ai", label: "AI 상담", href: "/ai-consultation" },
    ];

    const handleLogout = async () => {
        try {
            await api.logout();
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="relative flex items-center h-16 w-28 md:w-40">
                        <Image src="/images/logo.png" alt="logo" fill className="object-contain object-left" />
                    </Link>
                    {/* 데스크톱 메뉴 (md 이상) */}
                    <div className="hidden md:flex items-center gap-1">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-50"
                                    style={{ color: isActive ? "var(--brand-pink)" : "#6B7280" }}>
                                    <span className="text-sm">{tab.label}</span>
                                </Link>
                            );
                        })}
                        {isAuthenticated && user ? (
                            <div className="relative ml-3" ref={profileMenuRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white transition-all cursor-pointer">
                                    <ProfileAvatar nickname={user.nickname} size="sm" />
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-20">
                                        {user.nickname}
                                    </span>
                                    {isProfileMenuOpen ? (
                                        <ArrowUpIcon fill={"#505050"} />
                                    ) : (
                                        <ArrowDownIcon fill={"#505050"} />
                                    )}
                                </button>
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-30 animate-in fade-in slide-in-from-top-1">
                                        <div className="px-4 py-2.5 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user.nickname}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href="/mypage"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                <ProfileIcon />
                                                마이페이지
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsProfileMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
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
                                    color: pathname === "/login" ? "var(--brand-pink)" : "#6B7280",
                                }}>
                                <span className="text-sm">로그인</span>
                            </Link>
                        )}
                    </div>

                    {/* 모바일 햄버거 메뉴 버튼 */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <MenuIcon stroke="#374151" />
                    </button>
                </div>
            </div>

            {/* 모바일 메뉴 오버레이 */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed top-0 right-0 bottom-0 w-64 bg-white z-50 md:hidden shadow-xl animate-in slide-in-from-right">
                        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">메뉴</h2>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <CancelIcon stroke="#374151" />
                            </button>
                        </div>
                        <div className="py-4">
                            {isAuthenticated && user ? (
                                <div className="px-4 py-3 mb-2 border-b border-gray-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <ProfileAvatar nickname={user.nickname} size="md" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user.nickname}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/mypage"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        <ProfileIcon />
                                        마이페이지
                                    </Link>
                                </div>
                            ) : (
                                <div className="px-4 mb-2 pb-3 border-b border-gray-100">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-pink-500 to-orange-400 text-white rounded-lg font-medium hover:shadow-md transition-all">
                                        로그인
                                    </Link>
                                </div>
                            )}
                            <div className="px-2">
                                {tabs.map((tab) => {
                                    const isActive = pathname === tab.href;
                                    return (
                                        <Link
                                            key={tab.id}
                                            href={tab.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-gray-50 mb-1"
                                            style={{
                                                backgroundColor: isActive ? "rgba(255, 107, 157, 0.1)" : "transparent",
                                                color: isActive ? "var(--brand-pink)" : "#374151",
                                            }}>
                                            <span className="text-base font-medium">{tab.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                            {isAuthenticated && user && (
                                <div className="px-2 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex items-center gap-2.5 w-full px-4 py-3 text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                        <LogoutIcon stroke="#e7000b" />
                                        로그아웃
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
