"use client";

import SearchIcon from "public/icons/search-icon.svg";
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
        <div className="flex-1 flex">
            <input
                type="text"
                placeholder="게시글 검색..."
                value={inputValue}
                maxLength={POST_SEARCH_KEYWORD_LIMIT}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 pl-5 py-3 bg-white border border-gray-200 rounded-l-xl focus:outline-none focus:border-pink-300 transition-all"
            />
            <button
                onClick={handleSearch}
                className="px-3.5 flex items-center justify-center hover:opacity-90 transition-opacity rounded-r-xl"
                style={{ background: "var(--brand-gradient)" }}>
                <SearchIcon width="20px" height="20px" fill="#ffffff" />
            </button>
        </div>
    );
}
