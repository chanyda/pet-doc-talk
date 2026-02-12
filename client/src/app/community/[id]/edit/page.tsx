"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PostForm } from "@/components/community/posts/PostForm";
import { PostFormHeader } from "@/components/community/posts/PostFormHeader";
import { PostErrorState } from "@/components/community/posts/state/PostErrorState";
import { PostLoadingState } from "@/components/community/posts/state/PostLoadingState";
import { TopNavigation } from "@/components/layout/TopNavigation";
import * as api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function EditPostPage() {
    const params = useParams();
    const router = useRouter();
    const postId = Number(params.id);
    const { user } = useAuthStore();

    const [post, setPost] = useState<PostDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!user) return;

            try {
                setIsLoading(true);

                const { data } = await api.getPost(postId);

                if (data.user.id !== user.id) {
                    alert("수정 권한이 없습니다.");
                    router.push(`/community/${postId}`);
                    return;
                }

                setPost(data);
            } catch (error) {
                console.error("Failed to fetch post:", error);
                setError("게시글을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId, user, router]);

    if (isLoading) {
        return (
            <ProtectedRoute>
                <PostLoadingState />
            </ProtectedRoute>
        );
    }

    if (error || !post) {
        return (
            <ProtectedRoute>
                <PostErrorState message={error || undefined} />
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <TopNavigation />
                <main className="max-w-4xl mx-auto px-6 py-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <PostFormHeader mode="edit" />
                        <PostForm mode="edit" initialData={post} />
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
