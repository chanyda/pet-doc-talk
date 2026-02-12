interface User {
    id: number;
    email: string;
    name: string;
    nickname: string;
    profileImageUrl: string | null;
    postCount: number;
    commentCount: number;
    consultationCount: number;
    points: number;
}

type ProfileTab = "consultation" | "posts" | "comments" | "likes";
