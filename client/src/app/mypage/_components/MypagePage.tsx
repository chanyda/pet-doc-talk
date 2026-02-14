"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { TopNavigation } from "@/components/layout/TopNavigation";
import { MyComments } from "@/components/profile/MyComments";
import { MyConsultations } from "@/components/profile/MyConsultations";
import { MyPosts } from "@/components/profile/MyPosts";
import { Profile } from "@/components/profile/Profile";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

export default function MypagePage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const activeTab = (searchParams.get("tab") as ProfileTab) ?? "consultation";

    const renderTabContent = () => {
        switch (activeTab) {
            case "consultation":
                return <MyConsultations />;
            case "posts":
                return <MyPosts />;
            case "comments":
                return <MyComments />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
                <Profile />
                <ProfileTabs activeTab={activeTab} onTabChange={(tab) => router.replace(`?tab=${tab}`)} />
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">{renderTabContent()}</div>
            </main>
        </div>
    );
}
