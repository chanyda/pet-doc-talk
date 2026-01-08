export interface IPost {
    id: number;
    userId: number;
    categoryId: number;
    title: string;
    content: string;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
