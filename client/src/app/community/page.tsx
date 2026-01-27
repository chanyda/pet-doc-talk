"use client";

import { useState } from "react";

import { CommunityFilters } from "@/components/community/CommunityFilters";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { PostList } from "@/components/community/PostList";
import { TopNavigation } from "@/components/layout/TopNavigation";

export default function CommunityPage() {
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [sortBy, setSortBy] = useState("latest");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-6xl mx-auto px-6 py-8">
                <CommunityHeader />
                <CommunityFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
                <PostList category={selectedCategory} sortBy={sortBy} searchQuery={searchQuery} />
            </main>
        </div>
    );
}
