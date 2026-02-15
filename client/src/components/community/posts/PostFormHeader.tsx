interface PostFormHeaderProps {
    mode: PostMode;
}

export function PostFormHeader({ mode }: PostFormHeaderProps) {
    return (
        <div className="mb-5">
            {mode === "edit" ? (
                <>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">게시글 수정</h1>
                        <p className="text-gray-600">게시글 내용을 수정해주세요.</p>
                    </div>
                    <div className="mt-5" />
                </>
            ) : (
                <>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">게시글 작성</h1>
                        <p className="text-gray-600">반려동물과 관련된 이야기를 자유롭게 공유해보세요.</p>
                    </div>

                    <div className="mt-5 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-6 border border-pink-100">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">게시글 작성 팁</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• 제목은 간결하고 명확하게 작성해 주세요.</li>
                            <li>• 다른 사용자에게 도움이 될 수 있는 정보를 공유해 주세요.</li>
                            <li>• 사진을 첨부하면 더 많은 관심을 받을 수 있어요.</li>
                            <li>• 질문 글의 경우 상황을 자세히 설명해 주시면 좋아요.</li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
