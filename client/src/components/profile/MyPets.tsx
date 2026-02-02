"use client";

import { useRef, useState } from "react";

interface Pet {
    id: number;
    name: string;
    image?: string;
    gender: "남" | "여";
    species: string;
    age: number;
    weight: number;
}

const mockPets: Pet[] = [
    {
        id: 1,
        name: "뽀미",
        image: "https://es.unsplash.com/photo-1669215998827-084353c6f24c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY29yZ2klMjBkb2d8ZW58MXx8fHwxNzcwMDI1NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        gender: "여",
        species: "웰시코기",
        age: 4,
        weight: 12.5,
    },
    {
        id: 2,
        name: "코코",
        image: "https://es.unsplash.com/photo-1702914954859-f037fc75b760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzAwMjU1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        gender: "남",
        species: "코리안숏헤어",
        age: 5,
        weight: 4.8,
    },
    {
        id: 3,
        name: "골디",
        gender: "남",
        species: "골든리트리버",
        age: 3,
        weight: 32.0,
    },
];

function getAge(birthday: string) {
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

export function MyPets() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

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

    return (
        <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {/* <Sparkles size={20} style={{ color: "#FF6B9D" }} /> */}
                    <h3 className="text-lg font-medium">우리 가족</h3>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                    {/* <Plus size={16} /> */}
                    <span>추가</span>
                </button>
            </div>

            {mockPets.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">등록된 반려동물이 없습니다.</p>
                </div>
            ) : (
                <div className="relative">
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                            style={{ marginLeft: "-16px" }}>
                            {/* <ChevronLeft size={16} className="text-gray-700" /> */}
                        </button>
                    )}

                    {canScrollRight && (
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                            style={{ marginRight: "-16px" }}>
                            {/* <ChevronRight size={16} className="text-gray-700" /> */}
                        </button>
                    )}

                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex gap-4 overflow-x-auto"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                        {mockPets.map((pet) => (
                            <button
                                key={pet.id}
                                className="flex-shrink-0 w-64 p-4 rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 border-2 border-pink-200 hover:border-pink-300 hover:shadow-lg transition-all group">
                                <div className="flex items-center gap-3 mb-3">
                                    {pet.image ? (
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-md flex-shrink-0">
                                            <img
                                                src={pet.image}
                                                alt={pet.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-3 border-white shadow-md flex-shrink-0"
                                            style={{
                                                background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
                                            }}>
                                            {pet.species.includes("강아지") ||
                                            pet.species.includes("코기") ||
                                            pet.species.includes("리트리버")
                                                ? "🐶"
                                                : "🐱"}
                                        </div>
                                    )}

                                    <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-lg font-bold text-gray-900">{pet.name}</h4>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    pet.gender === "남"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-pink-200 text-pink-700"
                                                }`}>
                                                {pet.gender === "남" ? "♂" : "♀"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{pet.species}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white/70 rounded-lg px-3 py-2 text-center">
                                        <p className="text-xs text-gray-600 mb-0.5">나이</p>
                                        <p className="text-sm font-bold text-gray-900">{pet.age}살</p>
                                    </div>
                                    <div className="bg-white/70 rounded-lg px-3 py-2 text-center">
                                        <p className="text-xs text-gray-600 mb-0.5">체중</p>
                                        <p className="text-sm font-bold text-gray-900">{pet.weight}kg</p>
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
