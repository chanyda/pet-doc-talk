export function CommunityHeader() {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl mb-2">커뮤니티</h1>
                <p className="text-gray-600">반려동물과 함께하는 일상을 공유해보세요</p>
            </div>
            <button
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                style={{ backgroundColor: "#FF6B9D" }}>
                <span className="text-lg">✍️</span>
                <span>게시글 작성하기</span>
            </button>
        </div>
    );
}
