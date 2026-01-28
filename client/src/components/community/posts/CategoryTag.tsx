import { POST_CATEGORY_COLOR } from "@/constants/style";

interface CategoryTagProps {
    category: PostCategory;
}

export function CategoryTag({ category }: CategoryTagProps) {
    return (
        <div>
            <span className={`inline-block text-sm px-3 py-1 rounded-full ${POST_CATEGORY_COLOR[category.id]}`}>
                {category.name}
            </span>
        </div>
    );
}
