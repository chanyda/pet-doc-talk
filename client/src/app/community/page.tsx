"use client";

import { useState } from "react";

import { CommunityFilters } from "@/components/community/CommunityFilters";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { PostList } from "@/components/community/PostList";
import { TopNavigation } from "@/components/layout/TopNavigation";

export default function CommunityPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [orderBy, setOrderBy] = useState<OrderByType>("createdAt");
    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-6xl mx-auto px-6 py-8">
                <CommunityHeader />
                <CommunityFilters
                    selectedCategoryId={selectedCategoryId}
                    onCategoryChange={setSelectedCategoryId}
                    orderBy={orderBy}
                    onOrderByChange={setOrderBy}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
                <PostList categoryId={selectedCategoryId} orderBy={orderBy} searchQuery={searchQuery} />
            </main>
        </div>
    );
}
