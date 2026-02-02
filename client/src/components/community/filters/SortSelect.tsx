"use client";

import { useState } from "react";

import { POST_ORDER_BY_OPTIONS } from "@/constants/post";
import { useOutsideClick } from "@/hooks/useClickOutside";

interface SortSelectProps {
    value: OrderByType;
    onChange: (value: OrderByType) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
    const [isActionMenuOption, setIsActionMenuOption] = useState(false);
    const actionMenuRef = useOutsideClick(() => setIsActionMenuOption(false));
    const selectedOption = POST_ORDER_BY_OPTIONS.find((opt) => opt.id === value);

    const handleSelect = (order: OrderByType) => {
        onChange(order);
        setIsActionMenuOption(false);
    };

    return (
        <div className="relative" ref={actionMenuRef}>
            <button
                onClick={() => setIsActionMenuOption(!isActionMenuOption)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <span className="text-sm text-gray-700">{selectedOption?.label}</span>
                <span className="text-gray-400 text-sm">▼</span>
            </button>
            {isActionMenuOption && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                    {POST_ORDER_BY_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleSelect(option.id)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                                value === option.id ? "text-pink-600" : "text-gray-700"
                            }`}
                            style={{
                                backgroundColor: value === option.id ? "#FFF1F5" : "transparent",
                            }}>
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
