import { PenSquare, HelpCircle, Clock } from 'lucide-react';

const actions = [
  {
    id: 1,
    icon: PenSquare,
    label: '커뮤니티 글 작성',
    description: '이야기 나누기',
    bgColor: 'bg-pink-50',
    iconColor: '#FF6B9D',
  },
  {
    id: 2,
    icon: HelpCircle,
    label: '자주 묻는 질문',
    description: 'FAQ 보기',
    bgColor: 'bg-orange-50',
    iconColor: '#FFA07A',
  },
  {
    id: 3,
    icon: Clock,
    label: 'AI 상담 기록',
    description: '히스토리 확인',
    bgColor: 'bg-purple-50',
    iconColor: '#9B87F5',
  },
];

export function QuickActions() {
  return (
    <section>
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className={`${action.bgColor} rounded-xl p-6 hover:shadow-md transition-all hover:scale-105`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">
                  <Icon size={32} style={{ color: action.iconColor }} />
                </div>
                <span className="text-sm text-gray-900 mb-1">
                  {action.label}
                </span>
                <span className="text-xs text-gray-500">
                  {action.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
