import { useState } from "react";
import { TopNavigation } from "./TopNavigation";
import { HeroSection } from "./HeroSection";
import { QuickActions } from "./QuickActions";
import { CommunitySection } from "./CommunitySection";
import { InfoCards } from "./InfoCards";

export function Home() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section - AI Consult CTA */}
            <HeroSection />

            {/* Quick Actions */}
            <QuickActions />

            {/* Community Section */}
            <CommunitySection />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info Cards */}
            <InfoCards />
          </div>
        </div>
      </main>
    </div>
  );
}
