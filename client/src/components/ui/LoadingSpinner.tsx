"use client";

export function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center py-20">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin"></div>
                <span className="text-gray-600">불러오는 중...</span>
            </div>
        </div>
    );
}
