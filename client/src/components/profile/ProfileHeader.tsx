"use client";

import { useRef, useState } from "react";

import { MyPets } from "./MyPets";

interface Pet {
    id: number;
    name: string;
    image?: string;
    gender: "남" | "여";
    species: string;
    age: number;
    weight: number;
}

const mockUser = {
    email: "petlover@example.com",
    name: "김펫케어",
    nickname: "뽀미맘",
    profileImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
};

const mockPets: Pet[] = [
    {
        id: 1,
        name: "뽀미",
        image: "https://images.unsplash.com/photo-1669215998827-084353c6f24c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY29yZ2klMjBkb2d8ZW58MXx8fHwxNzcwMDI1NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        gender: "여",
        species: "웰시코기",
        age: 4,
        weight: 12.5,
    },
    {
        id: 2,
        name: "코코",
        image: "https://images.unsplash.com/photo-1702914954859-f037fc75b760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBjYXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzAwMjU1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
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

export function ProfileHeader() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(mockPets.length > 2);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 280;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                {/* Profile Image */}
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-br from-pink-400 to-orange-400 shadow-lg">
                        <img src={mockUser.profileImage} alt={mockUser.name} className="w-full h-full object-cover" />
                    </div>
                    <div
                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
                        style={{
                            background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
                        }}>
                        {/* <Edit size={18} className="text-white" /> */}
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl mb-2">{mockUser.name}</h1>
                    <p className="text-xl text-gray-600 mb-3">@{mockUser.nickname}</p>

                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-6">
                        {/* <Mail size={18} /> */}
                        <span>{mockUser.email}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center md:justify-start gap-6 mb-6">
                        <div className="flex gap-2 text-center">
                            <div className="text-sm text-gray-600">상담내역</div>
                            <div className="text-sm font-bold">3</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200" />
                        <div className="flex gap-2 text-center">
                            <div className="text-sm text-gray-600">게시글</div>
                            <div className="text-sm font-bold">24</div>
                        </div>
                        <div className="w-px h-10 bg-gray-200" />
                        <div className="flex gap-2 text-center">
                            <div className="text-sm text-gray-600">댓글</div>
                            <div className="text-sm font-bold">156</div>
                        </div>
                    </div>
                </div>
            </div>
            <MyPets />
        </div>
    );
}
