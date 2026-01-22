import { TrendingUp, BookOpen } from 'lucide-react';

export function InfoCards() {
  return (
    <section className="space-y-4 sticky top-20">
      {/* Popular Questions Card */}
      <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6 border border-pink-100">
        <div className="flex items-start gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#FF6B9D20' }}
          >
            <TrendingUp size={24} style={{ color: '#FF6B9D' }} />
          </div>
          <div className="flex-1">
            <h3 className="mb-1">이번 주 인기 질문 TOP 3</h3>
          </div>
        </div>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: '#FF6B9D' }}>1.</span>
            <span>강아지가 밥을 안 먹어요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: '#FF6B9D' }}>2.</span>
            <span>고양이 털갈이 시즌 관리법</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0" style={{ color: '#FF6B9D' }}>3.</span>
            <span>처음 입양 시 준비물</span>
          </li>
        </ul>
      </div>

      {/* Service Guide Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1">처음 오셨나요?</h3>
            <p className="text-sm text-gray-600">서비스 이용 가이드</p>
          </div>
        </div>
        <button 
          className="w-full py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          style={{ 
            backgroundColor: '#FF6B9D',
            color: 'white'
          }}
        >
          가이드 보기
        </button>
      </div>
    </section>
  );
}
