import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-gray-600">?</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없습니다.</h1>
                <p className="text-gray-600 mb-6">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
                <Link
                    href="/"
                    className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all text-center">
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
