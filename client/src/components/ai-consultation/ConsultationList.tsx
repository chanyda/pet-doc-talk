"use client";

import Image from "next/image";
import ArrowRightIcon from "public/icons/arrow-right-icon.svg";
import CatFaceIcon from "public/icons/cat-face-icon.svg";
import DogFaceIcon from "public/icons/dog-face-icon.svg";
import PlusIcon from "public/icons/plus-icon.svg";
import { useState } from "react";

import { HasMoreButton } from "@/components/ui/HasMoreButton";
import { useConsultationList } from "@/hooks/useConsultationList";
import { createConsultation } from "@/lib/api";
import { formatLocalDateTime } from "@/utils/date";

import { PetSelectionModal } from "../modals/PetSelectionModal";

interface ConsultationListPageProps {
    onStartChat: (consultationId: number) => void;
    onViewChat: (consultationId: number) => void;
}

export function ConsultationList({ onStartChat, onViewChat }: ConsultationListPageProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { consultations, nextCursor, isLoading, totalConsultationCount, handleLoadMore } = useConsultationList();

    const handleNewConsultation = () => {
        setIsModalOpen(true);
    };

    const handleSelectPet = async (petId: number) => {
        try {
            const response = await createConsultation({ petId });
            setIsModalOpen(false);
            onStartChat(response.data.id);
        } catch (error) {
            console.error("Failed to create consultation:", error);
            alert("상담 생성에 실패했습니다.");
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
                <button
                    onClick={handleNewConsultation}
                    className="px-6 py-3 text-white rounded-xl transition-all hover:scale-105 shadow-lg flex items-center gap-2 font-medium"
                    style={{
                        background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
                    }}>
                    <PlusIcon size={20} stroke="#ffffff" />
                    <span>새 상담 시작</span>
                </button>
            </div>
            <div>
                {consultations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
                            <span className="text-6xl">🩺</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">아직 상담 내역이 없습니다.</h2>
                        <p className="text-gray-600 mb-8 text-center">AI 수의사와 반려동물 건강에 대해 상담해보세요.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full">
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">⏰</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">24시간 상담</h3>
                                <p className="text-sm text-gray-600">언제든지 AI 수의사에게 상담받으세요.</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">정확한 답변</h3>
                                <p className="text-sm text-gray-600">반려동물 정보 기반 맞춤 상담</p>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">📝</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">상담 기록</h3>
                                <p className="text-sm text-gray-600">모든 상담 내역이 자동 저장됩니다.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                상담 내역 <span className="text-pink-600">({totalConsultationCount})</span>
                            </h2>
                        </div>

                        {consultations.map((consultation) => (
                            <div
                                key={consultation.id}
                                onClick={() => onViewChat(consultation.id)}
                                className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer group">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <span>
                                            {consultation.pet.imageUrl ? (
                                                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-md shrink-0">
                                                    <Image
                                                        src={consultation.pet.imageUrl}
                                                        alt={consultation.pet.name}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-3 border-white shadow-md shrink-0"
                                                    style={{
                                                        background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
                                                    }}>
                                                    {consultation.pet.type === "CAT" ? (
                                                        <CatFaceIcon width="30px" height="30px" />
                                                    ) : (
                                                        <DogFaceIcon width="30px" height="30px" />
                                                    )}
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-lg text-gray-900">{consultation.pet.name}</h3>
                                        </div>
                                        <p className="text-gray-700 mb-3 line-clamp-1">
                                            {consultation.title || "새로운 상담"}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                {formatLocalDateTime(consultation.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <ArrowRightIcon width="30px" height="30px" />
                                    </div>
                                </div>
                            </div>
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
