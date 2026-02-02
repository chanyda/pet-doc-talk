"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CommentSection } from "@/components/community/comments/CommentSection";
import { PostContent } from "@/components/community/posts/PostContent";
import { PostErrorState } from "@/components/community/posts/state/PostErrorState";
import { PostLoadingState } from "@/components/community/posts/state/PostLoadingState";
import { TopNavigation } from "@/components/layout/TopNavigation";
import * as api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const postId = Number(params.id);
    const [post, setPost] = useState<PostDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await api.getPost(postId);
                setPost(response.data);
            } catch (error) {
                console.error("Failed to fetch post:", error);
                setError("게시글을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleBack = () => {
        router.push("/community");
    };

    if (isLoading) {
        return <PostLoadingState />;
    }

    if (error || !post) {
        return <PostErrorState message={error || undefined} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    <PostContent post={post} currentUserId={user?.id ?? null} onBack={handleBack} />
                    <CommentSection postId={post.id} currentUser={user} />
                </div>
            </div>
        </div>
    );
}
