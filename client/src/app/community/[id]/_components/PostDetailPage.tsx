"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CommentSection } from "@/components/community/comments/CommentSection";
import { PostContent } from "@/components/community/posts/PostContent";
import { PostLoadingState } from "@/components/community/posts/state/PostLoadingState";
import { TopNavigation } from "@/components/layout/TopNavigation";
import * as api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Props {
    postId: number;
}

export default function PostDetailPage({ postId }: Props) {
    const router = useRouter();
    const [post, setPost] = useState<PostDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);

                const response = await api.getPost(postId);
                setPost(response.data);
            } catch (error) {
                console.error("Failed to fetch post:", error);
                toast.error("게시글을 불러오는데 실패했습니다.");
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

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    <PostContent post={post} currentUserId={user?.id ?? null} onBack={handleBack} />
                    <CommentSection postId={post.id} />
                </div>
            </div>
        </div>
    );
}
