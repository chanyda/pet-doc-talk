"use client";

const mockComments = [
    {
        id: 1,
        postTitle: "강아지 산책 시간은 얼마나 하시나요?",
        content: "저는 하루에 30분씩 2번 산책시켜요. 날씨가 좋으면 조금 더 길게 하기도 하구요!",
        createdAt: "2시간 전",
    },
    {
        id: 2,
        postTitle: "고양이가 밥을 잘 안먹어요",
        content: "저희 고양이도 그랬는데 사료를 바꿔보니까 잘 먹더라구요. 입맛이 까다로운가봐요 ㅎㅎ",
        createdAt: "5시간 전",
    },
    {
        id: 3,
        postTitle: "반려동물 보험 추천해주세요",
        content: "저는 OO보험 쓰고 있는데 괜찮아요. 병원비 부담이 많이 줄었어요!",
        createdAt: "1일 전",
    },
    {
        id: 4,
        postTitle: "강아지 미용 어디서 하시나요?",
        content: "XX동물병원에서 하는데 선생님이 너무 친절하세요. 강아지도 스트레스 안 받는 것 같아요",
        createdAt: "2일 전",
    },
    {
        id: 5,
        postTitle: "고양이 장난감 추천",
        content: "터널 장난감이랑 레이저 포인터 좋아해요! 운동량도 늘고 스트레스 해소에도 좋더라구요",
        createdAt: "3일 전",
    },
];

export function MyComments() {
    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl mb-1">내 댓글</h3>
                <p className="text-sm text-gray-600">총 {mockComments.length}개의 댓글을 작성했습니다</p>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
                {mockComments.map((comment) => (
                    <button
                        key={comment.id}
                        className="w-full p-5 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 transition-all border border-transparent hover:border-pink-200 group text-left">
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                {/* Post Title */}
                                <div className="flex items-center gap-2 mb-2">
                                    {/* <MessageSquare size={14} className="text-pink-600 flex-shrink-0" /> */}
                                    <h4 className="text-sm text-gray-600 line-clamp-1">{comment.postTitle}</h4>
                                </div>

                                {/* Comment Content */}
                                <p className="text-gray-900 mb-2 line-clamp-2">{comment.content}</p>

                                {/* Time */}
                                <span className="text-xs text-gray-500">{comment.createdAt}</span>
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
            {mockComments.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        {/* <MessageSquare size={32} className="text-gray-400" /> */}
                    </div>
                    <p className="text-gray-600 mb-2">작성한 댓글이 없습니다</p>
                    <p className="text-sm text-gray-500">다른 사람의 게시글에 댓글을 남겨보세요!</p>
                </div>
            )}
        </div>
    );
}
