"use client";

import { useRouter } from "next/navigation";

import { useConsultationList } from "@/hooks/useConsultationList";

import { ConsultationItem } from "../ai-consultation/ConsultationItem";
import { ConsultationEmptyState } from "../ui/ConsultationEmptyState";
import { HasMoreButton } from "../ui/HasMoreButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function MyConsultations() {
    const router = useRouter();
    const { consultations, nextCursor, isLoading, totalConsultationCount, handleLoadMore } = useConsultationList();

    const renderConsultationList = () => {
        if (consultations.length === 0 && isLoading) {
            return <LoadingSpinner />;
        }

        if (consultations.length === 0) {
            return <ConsultationEmptyState />;
        }

        return (
            <div className="space-y-3">
                {consultations.map((consultation) => (
                    <ConsultationItem
                        key={consultation.id}
                        consultation={consultation}
                        onClick={(id) => router.push(`/ai-consultation/${id}`)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">내 상담 내역</h3>
            </div>
            {renderConsultationList()}
            {nextCursor && consultations.length < totalConsultationCount && (
                <HasMoreButton isLoading={isLoading} onClick={handleLoadMore} />
            )}
        </div>
    );
}
