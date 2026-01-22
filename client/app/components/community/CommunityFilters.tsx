"use client";

import { useState } from "react";

interface CommunityFiltersProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const categories = [
    { id: "all", label: "전체", icon: "📚" },
    { id: "dog", label: "강아지", icon: "🐕" },
    { id: "cat", label: "고양이", icon: "🐱" },
    { id: "other", label: "기타동물", icon: "🐰" },
    { id: "daily", label: "일상", icon: "☀️" },
    { id: "question", label: "질문", icon: "❓" },
];

const sortOptions = [
    { id: "latest", label: "최신순" },
    { id: "popular", label: "인기순" },
    { id: "comments", label: "댓글많은순" },
];

export function CommunityFilters({
    selectedCategory,
    onCategoryChange,
    sortBy,
    onSortChange,
    searchQuery,
    onSearchChange,
}: CommunityFiltersProps) {
    const [showSortMenu, setShowSortMenu] = useState(false);

    return (
        <div className="space-y-4 mb-6">
            <div className="bg-white rounded-xl p-2 shadow-sm">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.label)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all ${
                                selectedCategory === category.label
                                    ? "text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                            style={{
                                backgroundColor: selectedCategory === category.label ? "#FF6B9D" : "transparent",
                            }}>
                            <span>{category.icon}</span>
                            <span className="text-sm">{category.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                    <input
                        type="text"
                        placeholder="게시글 검색..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <span className="text-sm text-gray-700">
                            {sortOptions.find((opt) => opt.id === sortBy)?.label}
                        </span>
                        <span className="text-gray-400 text-sm">▼</span>
                    </button>
                    {showSortMenu && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => {
                                        onSortChange(option.id);
                                        setShowSortMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                                        sortBy === option.id ? "text-pink-600" : "text-gray-700"
                                    }`}
                                    style={{
                                        backgroundColor: sortBy === option.id ? "#FFF1F5" : "transparent",
                                    }}>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
