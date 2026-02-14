"use client";

import { useState } from "react";

import { POST_SEARCH_KEYWORD_LIMIT } from "@/constants/post";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    const [inputValue, setInputValue] = useState<string>(value);

    const handleSearch = () => {
        onChange(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 한글의 경우 keydown 이벤트가 두번씩 실행되는 오류가 있어서 해당 분기문이 필수로 필요
        if (e.nativeEvent.isComposing) return;
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex-1 relative">
            <input
                type="text"
                placeholder="게시글 검색..."
                value={inputValue}
                maxLength={POST_SEARCH_KEYWORD_LIMIT}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-5 pr-20 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
            />
            <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm rounded-lg text-white hover:opacity-90 transition-opacity shadow-md hover:shadow-lg cursor-pointer"
                style={{ backgroundColor: "#FF6B9D" }}>
                검색
            </button>
        </div>
    );
}
