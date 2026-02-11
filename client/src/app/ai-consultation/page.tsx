"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Chat } from "@/components/ai-consultation/Chat";
import { ConsultationList } from "@/components/ai-consultation/ConsultationList";
import { TopNavigation } from "@/components/layout/TopNavigation";

export default function AIConsultationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const consultationIdFromUrl = searchParams.get("consultationId");

    const handleStartChat = (consultationId: number) => {
        router.push(`/ai-consultation?consultationId=${consultationId}`);
    };

    const handleViewChat = (consultationId: number) => {
        router.push(`/ai-consultation?consultationId=${consultationId}`);
    };

    const handleBackToList = () => {
        router.push("/ai-consultation");
    };

    if (consultationIdFromUrl) {
        const consultationId = parseInt(consultationIdFromUrl, 10);
        if (!isNaN(consultationId)) {
            return <Chat consultationId={consultationId} onBack={handleBackToList} />;
        }
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
