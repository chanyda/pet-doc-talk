"use client";

import { useState } from "react";

import { Chat } from "@/components/ai-consultation/Chat";
import { ConsultationList } from "@/components/ai-consultation/ConsultationList";
import { TopNavigation } from "@/components/layout/TopNavigation";

type ViewType = "list" | "chat";

export default function AIConsultationPage() {
    const [view, setView] = useState<ViewType>("list");
    const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null);

    const handleStartChat = (consultationId: number) => {
        setSelectedConsultationId(consultationId);
        setView("chat");
    };

    const handleViewChat = (consultationId: number) => {
        setSelectedConsultationId(consultationId);
        setView("chat");
    };

    const handleBackToList = () => {
        setView("list");
        setSelectedConsultationId(null);
    };

    if (view === "chat" && selectedConsultationId) {
        return <Chat consultationId={selectedConsultationId} onBack={handleBackToList} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-6xl mx-auto px-6 py-8">
                <ConsultationList onStartChat={handleStartChat} onViewChat={handleViewChat} />
            </main>
        </div>
    );
}
