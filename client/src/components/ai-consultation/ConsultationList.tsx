"use client";

import { useRouter } from "next/navigation";
import PlusIcon from "public/icons/plus-icon.svg";
import { useState } from "react";
import { toast } from "sonner";

import { HasMoreButton } from "@/components/ui/HasMoreButton";
import { useConsultationList } from "@/hooks/useConsultationList";
import { createConsultation } from "@/lib/api";

import { PetSelectionModal } from "../modals/PetSelectionModal";
import { ConsultationEmptyState } from "../ui/ConsultationEmptyState";
import { StyledButton } from "../ui/StyledButton";
import { ConsultationItem } from "./ConsultationItem";

export function ConsultationList() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { consultations, nextCursor, isLoading, totalConsultationCount, handleLoadMore } = useConsultationList();

    const handleNewConsultation = () => {
        setIsModalOpen(true);
    };

    const handleSelectPet = async (petId: number) => {
        try {
            const response = await createConsultation({ petId });
            setIsModalOpen(false);
            router.push(`/ai-consultation/${response.data.id}`);
        } catch (error) {
            console.error("Failed to create consultation:", error);
            toast.error("상담 생성에 실패했습니다.");
        }
    };

    return (
        <>
            <PetSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectPet={handleSelectPet}
            />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">AI 상담</h1>
                    <p className="text-sm text-gray-600 mt-1">AI 수의사가 24시간 상담해드립니다.</p>
                </div>
                <StyledButton onClick={handleNewConsultation}>
                    <PlusIcon size={20} stroke="#ffffff" />새 상담 시작
                </StyledButton>
            </div>
            <div>
                {consultations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <ConsultationEmptyState />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full">
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">⏰</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">24시간 상담</h3>
                                <p className="text-sm text-gray-600">언제든지 AI 수의사에게 상담받으세요.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">정확한 답변</h3>
                                <p className="text-sm text-gray-600">반려동물 정보 기반 맞춤 상담</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">📝</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">상담 기록</h3>
                                <p className="text-sm text-gray-600">모든 상담 내역이 자동 저장됩니다.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                상담 내역 <span className="text-pink-600">({totalConsultationCount})</span>
                            </h2>
                        </div>

                        {consultations.map((consultation) => (
                            <ConsultationItem key={consultation.id} consultation={consultation} onClick={(id) => router.push(`/ai-consultation/${id}`)} />
                        ))}
                        {nextCursor && consultations.length < totalConsultationCount && (
                            <HasMoreButton isLoading={isLoading} onClick={handleLoadMore} />
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
