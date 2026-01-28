"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CommentSection } from "@/components/community/CommentSection";
import { PostContent } from "@/components/community/PostContent";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { useAuthStore } from "@/store/authStore";

const mockPost: PostDetail = {
    id: 1,
    title: "Test",
    content: "테스트입니다",
    viewCount: 324,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    user: { id: 1, nickname: "chany", profileImageUrl: "" },
    category: { id: 1, name: "건강·상담·병원" },
};

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
                // const response = await getPost(postId);
                // setPost(response.data);
                setPost(mockPost);
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
        return (
            <div className="min-h-screen bg-gray-50">
                <TopNavigation />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex justify-center items-center py-20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border-3 border-pink-300 border-t-pink-600 rounded-full animate-spin"></div>
                            <span className="text-gray-600">게시글을 불러오는 중...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50">
                <TopNavigation />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg mb-4">{error || "게시글을 찾을 수 없습니다."}</p>
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                            목록으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    <PostContent post={post} currentUserId={user?.id || 0} onBack={handleBack} />
                    <CommentSection postId={post.id} currentUserId={user?.id || 0} />
                </div>
            </div>
        </div>
    );
}
