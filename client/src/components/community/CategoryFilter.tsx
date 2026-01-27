"use client";

import { useEffect, useState } from "react";

import * as api from "@/lib/api";

interface CategoryFilterProps {
    selectedCategoryId: number | null;
    onCategoryChange: (categoryId: number | null) => void;
}

export function CategoryFilter({ selectedCategoryId, onCategoryChange }: CategoryFilterProps) {
    const [categories, setCategories] = useState<Category[]>([]);

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

    const buttonClass = (isSelected: boolean) =>
        `flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
            isSelected ? "text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
        }`;

    return (
        <div className="bg-white rounded-xl p-2 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={buttonClass(selectedCategoryId === null)}
                    style={{
                        backgroundColor: selectedCategoryId === null ? "#FF6B9D" : "transparent",
                    }}>
                    <span className="text-sm">전체</span>
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={buttonClass(selectedCategoryId === category.id)}
                        style={{
                            backgroundColor: selectedCategoryId === category.id ? "#FF6B9D" : "transparent",
                        }}>
                        <span className="text-sm">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
