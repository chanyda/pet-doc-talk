export function getNextCursor<T extends { id: number }>(items: T[], limit: number): number | null {
    return items.length === limit ? items[items.length - 1].id : null;
}
