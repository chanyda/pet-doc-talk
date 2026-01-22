"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
    id: string;
    label: string;
    icon: string;
    href: string;
}

export function TopNavigation() {
    const pathname = usePathname();
    const tabs: Tab[] = [
        { id: "home", label: "홈", icon: "🏠", href: "/" },
        { id: "community", label: "커뮤니티", icon: "👥", href: "/community" },
        { id: "ai", label: "AI 상담", icon: "💬", href: "/ai" },
        { id: "mypage", label: "마이페이지", icon: "👤", href: "/mypage" },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
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
                                    <span className="text-lg">{tab.icon}</span>
                                    <span className="text-sm">{tab.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
