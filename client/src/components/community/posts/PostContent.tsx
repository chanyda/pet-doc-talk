"use client";

import DeleteIcon from "public/icons/delete-icon.svg";
import EditIcon from "public/icons/edit-icon.svg";
import PrevIcon from "public/icons/prev-icon.svg";

import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { formatLocalDateTime } from "@/utils/date";

import { CategoryTag } from "./CategoryTag";

interface PostContentProps {
    post: PostDetail;
    currentUserId: number | null;
    onBack?: () => void;
}

export function PostContent({ post, currentUserId, onBack }: PostContentProps) {
    const isAuthor = currentUserId && post.user.id === currentUserId;

    // TODO: 게시글 수정 처리하기
    const handleEdit = () => {
        console.log("Edit post");
    };

    // TODO: 게시글 삭제 처리하기
    const handleDelete = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            console.log("Delete post");
        }
    };

    return (
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
                        <PrevIcon />
                        <span>목록으로</span>
                    </button>
                )}
                <CategoryTag category={post.category} />
                <h1 className="text-3xl mb-4 mt-3">{post.title}</h1>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                            <ProfileAvatar
                                nickname={post.user.nickname}
                                profileImageUrl={post.user.profileImageUrl}
                                size="sm"
                            />
                            <span className="font-medium text-gray-900">{post.user.nickname}</span>
                        </span>
                        <span>•</span>
                        <span>{formatLocalDateTime(post.createdAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <span>조회</span>
                            {post.viewCount}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAuthor && (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <EditIcon fill={"#505050"} stroke={"#505050"} />
                                    <span>수정</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <DeleteIcon />
                                    <span>삭제</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-6">{post.content}</div>
                {/* {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {post.images.map((image, index) => (
                            <div key={index} className="rounded-xl overflow-hidden relative w-full h-auto">
                                <Image
                                    src={image}
                                    alt={`이미지 ${index + 1}`}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )} */}
                {/* Like Button */}
                {/* <div className="flex items-center justify-center pt-6 border-t border-gray-100">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all ${
                            isLiked ? "text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        style={{
                            background: isLiked ? "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)" : undefined,
                        }}>
                        <HeartIcon className={isLiked ? "fill-white" : ""} />
                        <span className="font-medium">좋아요 {likeCount}</span>
                    </button>
                </div> */}
            </div>
        </article>
    );
}
