"use client";

import Image from "next/image";
import ArrowLeftIcon from "public/icons/arrow-left-icon.svg";
import ArrowRightIcon from "public/icons/arrow-right-icon.svg";
import CatFaceIcon from "public/icons/cat-face-icon.svg";
import CheckIcon from "public/icons/check-icon.svg";
import DogFaceIcon from "public/icons/dog-face-icon.svg";
import PlusIcon from "public/icons/plus-icon.svg";
import { useEffect, useRef, useState } from "react";

import { PetRegistrationModal } from "@/components/modals/PetRegistrationModal";
import * as api from "@/lib/api";

interface MyPetsProps {
    mode?: "edit" | "select";
    selectedPetId?: number | null;
    onSelectPet?: (pet: Pet) => void;
}

export function MyPets({ mode = "edit", selectedPetId, onSelectPet }: MyPetsProps) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
    const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await api.getPets();
                setPets(response.data);
            } catch (error) {
                console.error("Failed to fetch pets:", error);
            }
        };

        fetchPets();
    }, []);

    const checkScrollAbility = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollWidth > clientWidth + 10);
        }
    };

    useEffect(() => {
        checkScrollAbility();
    }, [pets]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const genderStyle = (gender: PetGender) =>
        gender === "MALE" ? "bg-blue-100 text-blue-700" : "bg-pink-200 text-pink-700";

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setEditingPet(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPet(null);
    };

    const handleEditPet = (pet: Pet) => {
        setIsModalOpen(true);
        setEditingPet(pet);
    };

    const handlePetClick = (pet: Pet) => {
        if (mode === "select" && onSelectPet) {
            onSelectPet(pet);
        } else {
            handleEditPet(pet);
        }
    };

    const handleDeletePet = async () => {
        if (!editingPet) return;

        try {
            await api.deletePet(editingPet.id);

            setPets((prev) => prev.filter((p) => p.id !== editingPet.id));
            setIsModalOpen(false);
            setEditingPet(null);
        } catch (error) {
            console.error("반려동물 삭제 실패:", error);
        }
    };

    const handlePetSubmit = async (petData: PetRegistrationFormData) => {
        try {
            // 몸무게의 경우 소수점 두자리까지만 저장해줘야하므로, 두자리를 초과한 경우 두자리까지 잘라준다.
            if (petData.weight != null) {
                petData.weight = Math.trunc(petData.weight * 100) / 100;
            }

            if (editingPet) {
                const response = await api.updatePet(editingPet.id, petData);
                setPets((prev) => prev.map((p) => (p.id === editingPet.id ? response.data : p)));
            } else {
                const response = await api.createPet(petData);
                setPets((prev) => [response.data, ...prev]);
            }

            setIsModalOpen(false);
            setEditingPet(null);
        } catch (error) {
            console.error(editingPet ? "반려동물 수정 실패:" : "반려동물 등록 실패:", error);
        }
    };

    return (
        <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">소중한 우리 아이들 ({pets.length})</h3>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                    <PlusIcon stroke="#e60076" />
                    <span>추가</span>
                </button>
            </div>

            {pets.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">등록된 반려동물이 없습니다.</p>
                </div>
            ) : (
                <div className="relative">
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border"
                            style={{ marginLeft: "-16px" }}>
                            <ArrowLeftIcon />
                        </button>
                    )}
                    {canScrollRight && (
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border"
                            style={{ marginRight: "-16px" }}>
                            <ArrowRightIcon />
                        </button>
                    )}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex gap-4 overflow-x-auto"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                        {pets.map((pet) => {
                            const isSelected = mode === "select" && selectedPetId === pet.id;
                            return (
                                <button
                                    key={pet.id}
                                    onClick={() => handlePetClick(pet)}
                                    className={`shrink-0 w-64 p-4 rounded-2xl bg-linear-to-br from-pink-50 via-purple-50 to-orange-50 border-2 transition-all group relative ${
                                        isSelected
                                            ? "border-pink-500 shadow-xl"
                                            : "border-pink-200 hover:border-pink-300 hover:shadow-lg"
                                    }`}>
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                            <CheckIcon stroke="#ffffff" width="18px" height="18px" />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mb-3">
                                        {pet.imageUrl ? (
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-md shrink-0">
                                                <Image src={pet.imageUrl} alt={pet.name} />
                                            </div>
                                        ) : (
                                            <div
                                                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-3 border-white shadow-md shrink-0"
                                                style={{
                                                    background: "var(--brand-gradient)",
                                                }}>
                                                {pet.type === "CAT" ? (
                                                    <CatFaceIcon width="30px" height="30px" />
                                                ) : (
                                                    <DogFaceIcon width="30px" height="30px" />
                                                )}
                                            </div>
                                        )}
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-lg font-bold text-gray-900">{pet.name}</h4>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${genderStyle(pet.gender)}`}>
                                                    {pet.gender === "FEMALE" ? "♀" : "♂"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{pet.breed}</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`mt-3 text-xs text-center transition-colors ${
                                            isSelected
                                                ? "text-pink-600 font-medium"
                                                : "text-gray-500 group-hover:text-pink-600"
                                        }`}>
                                        {mode === "select"
                                            ? isSelected
                                                ? "선택됨"
                                                : "클릭하여 선택"
                                            : "클릭하여 수정"}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <PetRegistrationModal
                key={editingPet?.id ?? "new"}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handlePetSubmit}
                onDelete={handleDeletePet}
                isEditMode={!!editingPet}
                initialFormData={editingPet ? editingPet : undefined}
            />
        </div>
    );
}
