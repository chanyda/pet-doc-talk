import Link from "next/link";
import MailIcon from "public/icons/mail.icon.svg";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const serviceLinks = [
        { label: "홈", href: "/" },
        { label: "커뮤니티", href: "/community" },
        { label: "AI 상담", href: "/ai-consultation" },
    ];

    // const companyLinks = [
    //     { label: "서비스 소개", href: "/about" },
    //     { label: "공지사항", href: "/notice" },
    //     { label: "문의하기", href: "/contact" },
    // ];

    // const legalLinks = [
    //     { label: "이용약관", href: "/terms" },
    //     { label: "개인정보처리방침", href: "/privacy" },
    // ];

    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            AI 기술로 반려동물의 건강을 케어하는 펫닥톡입니다.
                            <br />
                            반려동물과 함께하는 행복한 일상을 응원합니다.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-6">
                            <span>© {currentYear} PetDocTalk</span>
                            <span className="text-gray-300">|</span>
                            <span>All rights reserved</span>
                        </div>
                        <div className="flex gap-2 text-xs text-gray-500">
                            <MailIcon stroke="#6a7282" width="18px" height="18px" />
                            <span>qkrcodms99@gmail.com</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-4">서비스</h3>
                        <ul className="space-y-3">
                            {serviceLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-pink-600 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        <strong className="text-gray-700">주의사항:</strong> 펫닥톡의 AI 상담 서비스는 의료 진단을
                        대체할 수 없습니다. 반려동물의 건강에 심각한 문제가 있거나 응급 상황인 경우 반드시 가까운
                        동물병원을 방문하시기 바랍니다.
                    </p>
                </div>
            </div>
        </footer>
    );
}
