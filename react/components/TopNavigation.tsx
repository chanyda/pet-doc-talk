import { Home, Users, MessageCircle, User } from 'lucide-react';

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TopNavigation({ activeTab, onTabChange }: TopNavigationProps) {
  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'community', label: '커뮤니티', icon: Users },
    { id: 'ai', label: 'AI 상담', icon: MessageCircle },
    { id: 'mypage', label: '마이페이지', icon: User },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl" style={{ color: '#FF6B9D' }}>🐾 펫케어</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-50"
                  style={{ color: isActive ? '#FF6B9D' : '#6B7280' }}
                >
                  <Icon size={20} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
