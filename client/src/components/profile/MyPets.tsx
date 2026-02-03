"use client";

import Image from "next/image";
import ArrowLeftIcon from "public/icons/arrow-left-icon.svg";
import ArrowRightIcon from "public/icons/arrow-right-icon.svg";
import CatIcon from "public/icons/cat-icon.svg";
import DogIcon from "public/icons/dog-icon.svg";
import PlusIcon from "public/icons/plus-icon.svg";
import { useEffect, useRef, useState } from "react";

import * as api from "@/lib/api";

export function MyPets() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
    const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

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

    return (
        <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">나의 반려들</h3>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
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
                        {pets.map((pet) => (
                            <button
                                key={pet.id}
                                className="flex-shrink-0 w-64 p-4 rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 border-2 border-pink-200 hover:border-pink-300 hover:shadow-lg transition-all group">
                                <div className="flex items-center gap-3 mb-3">
                                    {pet.imageUrl ? (
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-md flex-shrink-0">
                                            <Image src={pet.imageUrl} alt={pet.name} />
                                        </div>
                                    ) : (
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-3 border-white shadow-md flex-shrink-0"
                                            style={{
                                                background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
                                            }}>
                                            {pet.type === "CAT" ? <CatIcon /> : <DogIcon />}
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
                                <div className="mt-3 text-xs text-center text-gray-500 group-hover:text-pink-600 transition-colors">
                                    클릭하여 수정
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
