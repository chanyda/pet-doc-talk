import Link from "next/link";
import ArrowRightIcon from "public/icons/arrow-right-icon.svg";
import TrendUpIcon from "public/icons/trend-up-icon.svg";

import { PostList } from "@/components/community/posts/PostList";
import AIConsultationHero from "@/components/home/AiConsultationHero";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { POPULAR_PAGE_LIMIT } from "@/constants/common";

export default function Page() {
    return (
        <div className="min-h-screen">
            <TopNavigation />
            <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-orange-50">
                <AIConsultationHero />
                <section className="py-8 md:py-12 px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-linear-to-br from-pink-100 to-orange-100 rounded-xl flex items-center justify-center">
                                    <TrendUpIcon fill="var(--brand-pink)" width="25px" height="25px" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">인기 게시글</h2>
                                    <p className="text-sm text-gray-600">가장 많이 본 커뮤니티 글</p>
                                </div>
                            </div>
                            <Link
                                href="/community"
                                className="px-3 md:px-5 py-2.5 text-pink-600 hover:bg-pink-50 rounded-xl transition-colors font-medium flex items-center gap-2 shrink-0">
                                <span className="hidden md:inline">전체 보기</span>
                                <ArrowRightIcon stroke="#e60076" />
                            </Link>
                        </div>
                        <PostList orderBy="viewCount" limit={POPULAR_PAGE_LIMIT} />
                    </div>
                </section>
            </div>
        </div>
    );
}
