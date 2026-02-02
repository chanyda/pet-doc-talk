interface User {
    id: number;
    email: string;
    name: string;
    nickname: string;
    profileImageUrl: string | null;
    // 필요한 다른 사용자 필드 추가
}

type ProfileTab = "consultation" | "posts" | "comments" | "likes";
