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
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-pink-200 p-5">
            <div className="flex gap-4">
                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <CategoryTag category={post.category} />
                        </div>
                    </div>
                    <h3 className="text-lg mb-3 line-clamp-1 hover:text-pink-600 transition-colors">{post.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <ProfileAvatar
                                    nickname={post.user.nickname}
                                    profileImageUrl={post.user.profileImageUrl}
                                    size="sm"
                                />
                                <span className="text-sm text-gray-700">{post.user.nickname}</span>
                            </div>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                {formatPostDate(post.createdAt)}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <span>조회</span>
                                <span>{post.viewCount}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <CommentIcon />
                            <span>{post.commentCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
