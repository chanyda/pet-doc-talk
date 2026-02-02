"use client";

import { useState } from "react";

import { TopNavigation } from "@/components/layout/TopNavigation";
import { MyComments } from "@/components/profile/MyComments";
import { MyConsultationHistory } from "@/components/profile/MyConsultationHistory";
import { MyPosts } from "@/components/profile/MyPosts";
import { Profile } from "@/components/profile/Profile";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<ProfileTab>("consultation");

    const renderTabContent = () => {
        switch (activeTab) {
            case "consultation":
                return <MyConsultationHistory />;
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
                <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">{renderTabContent()}</div>
            </main>
        </div>
    );
}
