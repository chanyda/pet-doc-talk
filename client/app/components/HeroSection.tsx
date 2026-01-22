export function HeroSection() {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-3xl mb-3">오늘은 어떤 도움이 필요하신가요?</h2>
                <p className="text-gray-600 text-lg">AI 상담으로 지금 바로 궁금한 점을 해결해보세요.</p>
            </div>
            <button
                className="w-full rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                style={{
                    background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
                }}>
                <div className="flex items-center justify-between text-white">
                    <div className="flex-1 text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">✨</span>
                            <h3 className="text-2xl">AI 상담 시작하기</h3>
                        </div>
                        <p className="text-white/90 leading-relaxed">24시간 언제든지 반려동물 건강 상담이 가능해요</p>
                    </div>
                    <div className="ml-6">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <span className="text-4xl">✨</span>
                        </div>
                    </div>
                </div>
            </button>
        </section>
    );
}
