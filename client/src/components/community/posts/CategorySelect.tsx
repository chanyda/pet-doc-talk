"use client";

import ArrowDownIcon from "public/icons/arrow-down-icon.svg";
import ArrowUpIcon from "public/icons/arrow-up-icon.svg";
import { useEffect, useState } from "react";

import { useOutsideClick } from "@/hooks/useClickOutside";
import * as api from "@/lib/api";

interface CategorySelectProps {
    selectedCategoryId: number | null;
    onCategoryChange: (categoryId: number) => void;
}

export function CategorySelect({ selectedCategoryId, onCategoryChange }: CategorySelectProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const dropdownRef = useOutsideClick(() => setShowDropdown(false));

    const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 <span className="text-pink-600">*</span>
            </label>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                        selectedCategory ? "border-pink-200 bg-pink-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <span className={selectedCategory ? "text-gray-900" : "text-gray-400"}>
                        {selectedCategory?.name || "카테고리를 선택하세요."}
                    </span>
                    {showDropdown ? <ArrowUpIcon fill={"#505050"} /> : <ArrowDownIcon fill={"#505050"} />}
                </button>

                {showDropdown && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    onCategoryChange(category.id);
                                    setShowDropdown(false);
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-pink-50 transition-colors cursor-pointer ${
                                    selectedCategoryId === category.id ? "bg-pink-50 text-pink-600" : "text-gray-700"
                                }`}>
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
