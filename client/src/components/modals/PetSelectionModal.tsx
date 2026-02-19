"use client";

import CancelIcon from "public/icons/cancel-icon.svg";
import { useState } from "react";
import { toast } from "sonner";

import { MyPets } from "../profile/MyPets";

interface PetSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPet: (petId: number) => void;
}

export function PetSelectionModal({ isOpen, onClose, onSelectPet }: PetSelectionModalProps) {
    const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

    const handleSelectPet = (pet: Pet) => {
        setSelectedPetId(pet.id);
    };

    const handleSubmit = () => {
        if (selectedPetId) {
            onSelectPet(selectedPetId);
        } else {
            toast.warning("상담할 반려동물을 선택해주세요.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 rounded-t-3xl z-1">
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={onClose}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                            <CancelIcon />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                            반려동물 선택
                        </h2>
                    </div>
                </div>
                <div className="p-6">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">어떤 아이와 상담하시나요?</h3>
                        <p className="text-sm text-gray-600">상담받을 반려동물을 선택해주세요.</p>
                    </div>
                    <MyPets mode="select" selectedPetId={selectedPetId} onSelectPet={handleSelectPet} />
                    <div className="mt-6 bg-linear-to-br from-pink-50 to-orange-50 rounded-xl p-4 border-2 border-pink-100">
                        <div className="flex gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                <span className="text-lg">💡</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">안내</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    AI 수의사가 반려동물의 정보를 바탕으로 더 정확한 상담을 제공합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium cursor-pointer">
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedPetId}
                            className="flex-1 px-6 py-3 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                            style={{
                                background: selectedPetId
                                    ? "var(--brand-gradient)"
                                    : "#d1d5db",
                            }}>
                            상담 시작
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
