import { CategoryFilter } from "./CategoryFilter";
import { SearchBar } from "./SearchBar";
import { SortSelect } from "./SortSelect";

interface CommunityFiltersProps {
    selectedCategoryId: number | null;
    onCategoryChange: (categoryId: number | null) => void;
    orderBy: OrderByType;
    onOrderByChange: (order: OrderByType) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function CommunityFilters({
    selectedCategoryId,
    onCategoryChange,
    orderBy,
    onOrderByChange,
    searchQuery,
    onSearchChange,
}: CommunityFiltersProps) {
    return (
        <div className="space-y-4 mb-6">
            <CategoryFilter selectedCategoryId={selectedCategoryId} onCategoryChange={onCategoryChange} />
            <div className="flex items-center gap-3">
                <SearchBar value={searchQuery} onChange={onSearchChange} />
                <SortSelect value={orderBy} onChange={onOrderByChange} />
            </div>
        </div>
    );
}
