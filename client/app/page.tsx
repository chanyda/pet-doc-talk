import { TopNavigation } from "./components/layout/TopNavigation";
import { HeroSection } from "./components/HeroSection";
import { QuickActions } from "./components/QuickActions";
import { CommunitySection } from "./components/CommunitySection";
import { InfoCards } from "./components/InfoCards";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <HeroSection />
                        <QuickActions />
                        <CommunitySection />
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <InfoCards />
                    </div>
                </div>
            </main>
        </div>
    );
}
