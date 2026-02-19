import { CategoryFilter } from "./CategoryFilter";
import { SearchBar } from "./SearchBar";
import { SortSelect } from "./SortSelect";

interface CommunityFilterProps {
    selectedCategoryId: number | null;
    onCategoryChange: (categoryId: number | null) => void;
    orderBy: OrderByType;
    onOrderByChange: (order: OrderByType) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function CommunityFilter({
    selectedCategoryId,
    onCategoryChange,
    orderBy,
    onOrderByChange,
    searchQuery,
    onSearchChange,
}: CommunityFilterProps) {
    return (
        <div className="space-y-4 mb-6">
            <CategoryFilter selectedCategoryId={selectedCategoryId} onCategoryChange={onCategoryChange} />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <SearchBar value={searchQuery} onChange={onSearchChange} />
                <SortSelect value={orderBy} onChange={onOrderByChange} />
            </div>
        </div>
    );
}
