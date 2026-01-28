"use client";

import { useState } from "react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    const [inputValue, setInputValue] = useState(value);

    const handleSearch = () => {
        onChange(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-5 pr-20 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
            />
            <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition-colors">
                검색
            </button>
        </div>
    );
}
