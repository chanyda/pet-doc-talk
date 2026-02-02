import { TopNavigation } from "@/components/layout/TopNavigation";

export function PostLoadingState() {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center py-20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border-3 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
                        <span className="text-gray-600">게시글을 불러오는 중...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
