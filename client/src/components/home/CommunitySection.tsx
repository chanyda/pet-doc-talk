"use client";

import Link from "next/link";

interface Post {
    id: number;
    title: string;
    category: string;
    author: string;
    likes: number;
    comments: number;
}

const mockPosts: Post[] = [
    {
        id: 1,
        title: "강아지가 밥을 안 먹어요",
        category: "건강",
        author: "뽀미맘",
        likes: 24,
        comments: 12,
    },
    {
        id: 2,
        title: "고양이 장난감 추천해주세요!",
        category: "용품",
        author: "냥집사",
        likes: 18,
        comments: 8,
    },
    {
        id: 3,
        title: "산책 코스 공유합니다 (한강공원)",
        category: "일상",
        author: "산책왕",
        likes: 45,
        comments: 23,
    },
    {
        id: 4,
        title: "처음 입양했는데 조언 부탁드려요",
        category: "질문",
        author: "초보집사",
        likes: 67,
        comments: 34,
    },
    {
        id: 5,
        title: "우리 댕댕이 생일 파티 했어요 🎉",
        category: "일상",
        author: "행복한집",
        likes: 92,
        comments: 45,
    },
];

const categoryColors: { [key: string]: string } = {
    건강: "bg-red-100 text-red-700",
    용품: "bg-blue-100 text-blue-700",
    일상: "bg-green-100 text-green-700",
    질문: "bg-purple-100 text-purple-700",
};

export function CommunitySection() {
    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl">🔥 지금 많이 보는 커뮤니티</h2>
                <Link
                    href="/community"
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                    style={{ color: "#FF6B9D" }}>
                    전체 커뮤니티 보기
                    <span className="text-lg">→</span>
                </Link>
            </div>
            <div className="space-y-4">
                {mockPosts.map((post) => (
                    <div
                        key={post.id}
                        className="p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100">
                        <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className={`text-xs px-2.5 py-1 rounded-full ${categoryColors[post.category]}`}>
                                        {post.category}
                                    </span>
                                    <span className="text-sm text-gray-500">{post.author}</span>
                                </div>
                                <h3 className="text-gray-900 mb-3 hover:underline">{post.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <span>❤️</span>
                                        <span>{post.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span>💬</span>
                                        <span>{post.comments}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
