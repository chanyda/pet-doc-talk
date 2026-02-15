"use client";

import { useState } from "react";

import { CommunityHeader } from "@/components/community/comments/CommunityHeader";
import { CommunityFilter } from "@/components/community/filters/CommunityFilter";
import { PostList } from "@/components/community/posts/PostList";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { DEFAULT_PAGE_LIMIT } from "@/constants/common";

export default function CommunityPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [orderBy, setOrderBy] = useState<OrderByType>("createdAt");
    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-6xl mx-auto px-6 py-8">
                <CommunityHeader />
                <CommunityFilter
                    selectedCategoryId={selectedCategoryId}
                    onCategoryChange={setSelectedCategoryId}
                    orderBy={orderBy}
                    onOrderByChange={setOrderBy}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
                <PostList
                    categoryId={selectedCategoryId}
                    orderBy={orderBy}
                    searchQuery={searchQuery}
                    limit={DEFAULT_PAGE_LIMIT}
                />
            </main>
        </div>
    );
}
