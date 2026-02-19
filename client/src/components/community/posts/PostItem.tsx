"use client";

import { useRouter } from "next/navigation";
import CommentIcon from "public/icons/comment-icon.svg";

import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { formatPostDate } from "@/utils/date";

import { CategoryTag } from "./CategoryTag";

interface PostItemProps {
    post: PostSummary;
}

export function PostItem({ post }: PostItemProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/community/${post.id}`);
    };

    return (
        <article
            onClick={handleClick}
            className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer">
            <div className="flex gap-4">
                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <CategoryTag category={post.category} />
                        </div>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold mb-3 line-clamp-1">{post.title}</h3>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0 mt-auto">
                        <div className="flex items-center gap-2 min-w-0">
                            <ProfileAvatar
                                nickname={post.user.nickname}
                                profileImageUrl={post.user.profileImageUrl}
                                size="sm"
                            />
                            <span className="text-sm text-gray-700 truncate">{post.user.nickname}</span>
                        </div>
                        <div className="flex items-center justify-between md:justify-start gap-3 md:gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                                <span>{formatPostDate(post.createdAt)}</span>
                                <span className="flex items-center gap-1">
                                    <span>조회</span>
                                    <span>{post.viewCount}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm">
                                <CommentIcon />
                                <span>{post.commentCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
