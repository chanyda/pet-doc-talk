"use client";

interface TopNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

interface Tab {
    id: string;
    label: string;
    icon: string;
}

export function TopNavigation({ activeTab, onTabChange }: TopNavigationProps) {
    const tabs: Tab[] = [
        { id: "home", label: "홈", icon: "🏠" },
        { id: "community", label: "커뮤니티", icon: "👥" },
        { id: "ai", label: "AI 상담", icon: "💬" },
        { id: "mypage", label: "마이페이지", icon: "👤" },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-xl" style={{ color: "#FF6B9D" }}>
                            🐾 펫케어
                        </h1>
                    </div>
                    <div className="flex items-center gap-1">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-50"
                                    style={{ color: isActive ? "#FF6B9D" : "#6B7280" }}>
                                    <span className="text-lg">{tab.icon}</span>
                                    <span className="text-sm">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
