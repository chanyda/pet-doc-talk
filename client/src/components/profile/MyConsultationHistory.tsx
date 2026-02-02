"use client";

const mockConsultations = [
    {
        id: 1,
        date: "2024-01-28",
        petName: "뽀미",
        summary: "산책 시 다른 강아지를 보고 짖는 문제에 대한 상담",
        messages: 24,
    },
    {
        id: 2,
        date: "2024-01-25",
        petName: "코코",
        summary: "고양이 식욕 부진 증상 및 건강 상태 확인",
        messages: 18,
    },
    {
        id: 3,
        date: "2024-01-20",
        petName: "뽀미",
        summary: "예방접종 시기와 준비사항에 대한 질문",
        messages: 12,
    },
    {
        id: 4,
        date: "2024-01-15",
        petName: "골디",
        summary: "강아지 훈련 방법과 사회화 교육 조언",
        messages: 30,
    },
    {
        id: 5,
        date: "2024-01-10",
        petName: "코코",
        summary: "고양이 털갈이 시기 관리 방법 상담",
        messages: 15,
    },
];

export function MyConsultationHistory() {
    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl mb-1">내 상담 내역</h3>
                <p className="text-sm text-gray-600">총 {mockConsultations.length}건의 상담 내역이 있습니다</p>
            </div>

            {/* Consultation List */}
            <div className="space-y-3">
                {mockConsultations.map((consultation) => (
                    <button
                        key={consultation.id}
                        className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 transition-all border border-transparent hover:border-pink-200 group">
                        <div className="flex items-center gap-4">
                            {/* Date */}
                            <div className="flex items-center gap-2 text-gray-600 min-w-[140px]">
                                {/* <Calendar size={16} /> */}
                                <span className="text-sm">{consultation.date}</span>
                            </div>

                            {/* Pet Badge */}
                            <div
                                className="px-3 py-1 rounded-full text-sm text-white"
                                style={{
                                    background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
                                }}>
                                {consultation.petName}
                            </div>

                            {/* Summary */}
                            <div className="flex-1 text-left">
                                <p className="text-gray-800 line-clamp-1">{consultation.summary}</p>
                                <p className="text-xs text-gray-500 mt-1">{consultation.messages}개의 메시지</p>
                            </div>

                            {/* Arrow */}
                            {/* <ChevronRight size={20} className="text-gray-400 group-hover:text-pink-600 transition-colors" /> */}
                        </div>
                    </button>
                ))}
            </div>

            {/* Empty State */}
            {mockConsultations.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        {/* <MessageCircle size={32} className="text-gray-400" /> */}
                    </div>
                    <p className="text-gray-600 mb-2">아직 상담 내역이 없습니다</p>
                    <p className="text-sm text-gray-500">AI 상담을 시작해보세요!</p>
                </div>
            )}
        </div>
    );
}
