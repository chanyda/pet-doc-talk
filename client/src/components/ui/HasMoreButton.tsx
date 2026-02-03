interface HasMoreButtonProps {
    isLoading: boolean;
    onClick: () => void;
}

export function HasMoreButton({ isLoading, onClick }: HasMoreButtonProps) {
    return (
        <div className="flex justify-center mt-8">
            <button
                onClick={onClick}
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
    );
}
