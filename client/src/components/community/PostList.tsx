"use client";

import { useCallback, useEffect, useState } from "react";

import { POSTS_LIMIT } from "@/constants/post";
import { getPosts } from "@/lib/api";

import { HasMoreButton } from "../ui/hasMoreButton";
import { PostItem } from "./PostItem";

interface PostListProps {
    categoryId: number | null;
    orderBy: OrderByType;
    searchQuery: string;
}

export function PostList({ categoryId, orderBy, searchQuery }: PostListProps) {
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const fetchPosts = useCallback(
        async (cursor?: number) => {
            try {
                const params: FindPostListQuery = {
                    limit: POSTS_LIMIT,
                    orderBy,
                };

                if (categoryId) {
                    params.categoryId = categoryId;
                }

                if (searchQuery) {
                    params.keyword = searchQuery;
                }

                if (cursor) {
                    params.cursor = cursor;
                }

                const response = await getPosts(params);
                const { posts: newPosts, nextCursor: newNextCursor } = response.data;

                if (cursor) {
                    setPosts((prev) => [...prev, ...newPosts]);
                } else {
                    setPosts(newPosts);
                }

                setNextCursor(newNextCursor);
            } catch (error) {
                setPosts([]);
                console.error("Failed to fetch posts:", error);
            }
        },
        [categoryId, orderBy, searchQuery],
    );

    useEffect(() => {
        const loadPosts = async () => {
            setIsInitialLoading(true);
            await fetchPosts();
            setIsInitialLoading(false);
        };

        loadPosts();
    }, [fetchPosts]);

    const handleLoadMore = async () => {
        if (!nextCursor || isLoading) return;

        setIsLoading(true);
        await fetchPosts(nextCursor);
        setIsLoading(false);
    };

    return isInitialLoading ? (
        <div className="flex justify-center items-center py-20">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-3 border-pink-300 border-t-pink-600 rounded-full animate-spin"></div>
                <span className="text-gray-600">게시글을 불러오는 중...</span>
            </div>
        </div>
    ) : (
        <div>
            <div className="space-y-3 mb-8">
                {posts.map((post) => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>
            {posts.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg mb-2">작성된 게시글이 없어요.</p>
                </div>
            )}
            {nextCursor && <HasMoreButton isLoading={isLoading} onClick={handleLoadMore} />}
        </div>
    );
}
