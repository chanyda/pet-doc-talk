import Link from "next/link";
import SparklesIcon from "public/icons/sparkles-icon.svg";

export default function AIConsultationHero() {
    return (
        <section className="pt-16 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div
                    className="relative overflow-hidden rounded-3xl shadow-2xl p-8 md:p-12"
                    style={{ background: "var(--brand-gradient)" }}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <SparklesIcon width="40px" height="40px" stroke="#ffffff" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">AI 수의사 상담</h1>
                                <p className="text-white/90 text-sm md:text-base">
                                    24시간 언제든지, 무료로 상담 받으세요.
                                </p>
                            </div>
                        </div>
                        <p className="text-white/90 mb-8 text-base md:text-lg max-w-2xl">
                            우리 아이의 건강이 걱정되시나요? AI 수의사가 빠르고 정확하게 답변해드립니다.
                        </p>
                        <Link
                            href="/ai-consultation"
                            className="group bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg inline-flex items-center gap-3">
                            <span>상담 시작하기</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
