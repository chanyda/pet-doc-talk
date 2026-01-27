"use client";

import { useEffect, useState } from "react";

import { PostItem } from "./PostItem";

interface PostListProps {
    category: string;
    sortBy: string;
    searchQuery: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    category: string;
    thumbnail: string | null;
    likes: number;
    comments: number;
    createdAt: string;
}

const mockPosts: Post[] = [
    {
        id: 1,
        title: "우리 강아지 처음 산책 나갔어요 🐕",
        content: "오늘 처음으로 공원에 데려갔는데 너무 좋아하더라구요!",
        author: "뽀미맘",
        category: "강아지",
        thumbnail:
            "https://images.unsplash.com/photo-1728359802819-e1eebdfcfdca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBwbGF5aW5nJTIwcGFya3xlbnwxfHx8fDE3NjkwMzIxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        likes: 124,
        comments: 32,
        createdAt: "2시간 전",
    },
    {
        id: 2,
        title: "고양이가 이상한 소리를 내요",
        content: "갑자기 이상한 소리를 내기 시작했는데 괜찮은 걸까요?",
        author: "냥집사",
        category: "질문",
        thumbnail:
            "https://images.unsplash.com/photo-1763942467199-af4207ee5320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXQlMjBzbGVlcGluZyUyMGNvenl8ZW58MXx8fHwxNzY5MDYyMzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        likes: 45,
        comments: 28,
        createdAt: "4시간 전",
    },
    {
        id: 3,
        title: "강아지 사료 추천 부탁드려요",
        content: "건강한 사료를 찾고 있는데 추천 부탁드립니다",
        author: "초보집사",
        category: "질문",
        thumbnail: null,
        likes: 89,
        comments: 56,
        createdAt: "6시간 전",
    },
    {
        id: 4,
        title: "우리 아기 생일 파티 했어요 🎉",
        content: "1살 생일을 맞이해서 케이크도 만들고 파티했어요",
        author: "행복한집",
        category: "일상",
        thumbnail:
            "https://images.unsplash.com/photo-1690985210626-885a2b0ba5ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXBweSUyMGN1dGUlMjBmYWNlfGVufDF8fHx8MTc2OTA4MDYwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        likes: 234,
        comments: 67,
        createdAt: "8시간 전",
    },
    {
        id: 5,
        title: "토끼 입양했어요!",
        content: "처음으로 토끼를 입양했는데 너무 귀여워요",
        author: "토끼사랑",
        category: "기타동물",
        thumbnail:
            "https://images.unsplash.com/photo-1609151354448-c4a53450c6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjByYWJiaXR8ZW58MXx8fHwxNzY5MDMyMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        likes: 156,
        comments: 42,
        createdAt: "10시간 전",
    },
    {
        id: 6,
        title: "반려동물 병원 추천해주세요",
        content: "서울 강남 쪽에 좋은 병원 있나요?",
        author: "건강지킴이",
        category: "질문",
        thumbnail: null,
        likes: 67,
        comments: 38,
        createdAt: "12시간 전",
    },
    {
        id: 7,
        title: "고양이 장난감 DIY 만들었어요",
        content: "집에 있는 재료로 장난감을 만들어봤어요",
        author: "만드는집사",
        category: "고양이",
        thumbnail: null,
        likes: 98,
        comments: 23,
        createdAt: "14시간 전",
    },
    {
        id: 8,
        title: "산책 코스 공유합니다 (한강공원)",
        content: "우리 강아지가 제일 좋아하는 산책 코스예요",
        author: "산책왕",
        category: "강아지",
        thumbnail: null,
        likes: 178,
        comments: 45,
        createdAt: "1일 전",
    },
];

const POSTS_PER_PAGE = 2;

export function PostList({ category, sortBy, searchQuery }: PostListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Filter and sort posts
    let filteredPosts = [...mockPosts];

    // Apply category filter
    if (category !== "전체") {
        filteredPosts = filteredPosts.filter((post) => post.category === category);
    }

    // Apply search filter
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(
            (post) =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }

    // Apply sorting
    if (sortBy === "popular") {
        filteredPosts.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "comments") {
        filteredPosts.sort((a, b) => b.comments - a.comments);
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [category, sortBy, searchQuery]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const endIndex = currentPage * POSTS_PER_PAGE;
    // 누적 방식: 1페이지부터 현재 페이지까지의 모든 게시글 표시
    const displayedPosts = filteredPosts.slice(0, endIndex);
    const hasMore = currentPage < totalPages;

    const handleLoadMore = () => {
        setIsLoading(true);

        setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            setIsLoading(false);
        }, 500);
    };

    return (
        <div>
            <div className="space-y-3 mb-8">
                {displayedPosts.map((post) => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>

            {/* No Results */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg mb-2">검색 결과가 없습니다</p>
                    <p className="text-gray-400 text-sm">다른 키워드로 검색해보세요</p>
                </div>
            )}

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="px-8 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all disabled:opacity-50"
                        style={{ color: "#FF6B9D" }}>
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-pink-300 border-t-pink-600 rounded-full animate-spin"></div>
                                불러오는 중...
                            </span>
                        ) : (
                            <span>더보기</span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
