"use client";

import { useRouter } from "next/navigation";

const mockPosts = [
    {
        id: 1,
        title: "우리 강아지 처음 산책 나갔어요 🐕",
        category: "강아지",
        createdAt: "2024-01-28",
        views: 256,
        likes: 124,
        comments: 32,
    },
    {
        id: 2,
        title: "고양이 간식 추천 부탁드려요!",
        category: "고양이",
        createdAt: "2024-01-25",
        views: 189,
        likes: 67,
        comments: 28,
    },
    {
        id: 3,
        title: "강아지 훈련 팁 공유합니다",
        category: "강아지",
        createdAt: "2024-01-22",
        views: 412,
        likes: 203,
        comments: 45,
    },
    {
        id: 4,
        title: "반려동물과 함께하는 여행 후기",
        category: "일상",
        createdAt: "2024-01-18",
        views: 321,
        likes: 156,
        comments: 38,
    },
];

const categoryColors: { [key: string]: string } = {
    강아지: "bg-blue-100 text-blue-700",
    고양이: "bg-purple-100 text-purple-700",
    기타동물: "bg-green-100 text-green-700",
    일상: "bg-orange-100 text-orange-700",
    질문: "bg-pink-100 text-pink-700",
};

export function MyPosts() {
    const router = useRouter();

    const handlePostClick = (id: number) => {
        router.push(`/community/${id}`);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl mb-1">내 게시글</h3>
                <p className="text-sm text-gray-600">총 {mockPosts.length}개의 게시글을 작성했습니다</p>
            </div>

            {/* Posts List */}
            <div className="space-y-3">
                {mockPosts.map((post) => (
                    <button
                        key={post.id}
                        onClick={() => handlePostClick(post.id)}
                        className="w-full p-5 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 transition-all border border-transparent hover:border-pink-200 group">
                        <div className="flex items-start gap-4">
                            <div className="flex-1 text-left">
                                {/* Category & Date */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className={`text-xs px-2.5 py-1 rounded-full ${categoryColors[post.category]}`}>
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{post.createdAt}</span>
                                </div>

                                {/* Title */}
                                <h4 className="text-gray-900 mb-3 line-clamp-1">{post.title}</h4>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        {/* <Eye size={14} /> */}
                                        {post.views}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {/* <Heart size={14} /> */}
                                        {post.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {/* <MessageSquare size={14} /> */}
                                        {post.comments}
                                    </span>
                                </div>
                            </div>

                            {/* Arrow */}
                            {/* <ChevronRight
                                size={20}
                                className="text-gray-400 group-hover:text-pink-600 transition-colors flex-shrink-0 mt-2"
                            /> */}
                        </div>
                    </button>
                ))}
            </div>

            {/* Empty State */}
            {mockPosts.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        {/* <FileText size={32} className="text-gray-400" /> */}
                    </div>
                    <p className="text-gray-600 mb-2">작성한 게시글이 없습니다</p>
                    <p className="text-sm text-gray-500">첫 게시글을 작성해보세요!</p>
                </div>
            )}
        </div>
    );
}
