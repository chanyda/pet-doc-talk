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
        `flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
            isSelected ? "text-white shadow-lg" : "text-gray-600 hover:bg-gray-50"
        }`;

    return (
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={buttonClass(selectedCategoryId === null)}
                    style={{
                        background: selectedCategoryId === null ? "var(--brand-gradient)" : "transparent",
                    }}>
                    <span className="text-sm font-medium">전체</span>
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={buttonClass(selectedCategoryId === category.id)}
                        style={{
                            background: selectedCategoryId === category.id ? "var(--brand-gradient)" : "transparent",
                        }}>
                        <span className="text-sm font-medium">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
