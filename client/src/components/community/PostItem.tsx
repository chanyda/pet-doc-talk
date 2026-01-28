"use client";

import { useRouter } from "next/navigation";
import ClockIcon from "public/icons/clock-icon.svg";
import CommentIcon from "public/icons/comment-icon.svg";

import { POST_CATEGORY_COLOR } from "@/constants/style";
import { formatRelativeTime } from "@/utils/date";

import { ProfileAvatar } from "../ui/ProfileAvatar";

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
                            <span
                                className={`text-xs px-2.5 py-1 rounded-full ${POST_CATEGORY_COLOR[post.category.id]}`}>
                                {post.category.name}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                <ClockIcon />
                                {formatRelativeTime(post.createdAt)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span>조회</span>
                            <span>{post.viewCount}</span>
                        </div>
                    </div>
                    <h3 className="text-lg mb-3 line-clamp-1 hover:text-pink-600 transition-colors">{post.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                            <ProfileAvatar
                                nickname={post.user.nickname}
                                profileImageUrl={post.user.profileImageUrl}
                                size="sm"
                            />
                            <span className="text-sm text-gray-700">{post.user.nickname}</span>
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
