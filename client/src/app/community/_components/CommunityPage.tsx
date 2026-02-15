"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { CommunityHeader } from "@/components/community/comments/CommunityHeader";
import { CommunityFilter } from "@/components/community/filters/CommunityFilter";
import { PostList } from "@/components/community/posts/PostList";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { DEFAULT_PAGE_LIMIT } from "@/constants/common";

export default function CommunityPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedCategoryId = searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null;
    const orderBy = (searchParams.get("orderBy") as OrderByType) ?? "createdAt";
    const searchQuery = searchParams.get("search") ?? "";

    const setParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.replace(`/community?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-6xl mx-auto px-6 py-8">
                <CommunityHeader />
                <CommunityFilter
                    selectedCategoryId={selectedCategoryId}
                    onCategoryChange={(id) => setParam("categoryId", id ? String(id) : null)}
                    orderBy={orderBy}
                    onOrderByChange={(order) => setParam("orderBy", order === "createdAt" ? null : order)}
                    searchQuery={searchQuery}
                    onSearchChange={(query) => setParam("search", query)}
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
