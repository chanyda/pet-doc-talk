"use client";

interface ProfileTabsProps {
    activeTab: ProfileTab;
    onTabChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
    const tabs = [
        { id: "consultation" as const, label: "내 상담 내역" },
        { id: "posts" as const, label: "내 게시글" },
        { id: "comments" as const, label: "내 댓글" },
        // { id: "likes" as const, label: "내 공감 목록" },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            <div
                className="flex items-center gap-2 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                                isActive ? "text-white shadow-lg" : "text-gray-600 hover:bg-gray-50"
                            }`}
                            style={{
                                background: isActive ? "var(--brand-gradient)" : "transparent",
                            }}>
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
