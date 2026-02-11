"use client";

import SettingIcon from "public/icons/setting-icon.svg";
import { useEffect, useState } from "react";

import * as api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

import { ProfileEditModal } from "../modals/ProfileEditModal";
import { ProfileAvatar } from "../ui/ProfileAvatar";
import { MyPets } from "./MyPets";

export function Profile() {
    const { setUser: setAuthUser } = useAuthStore();
    const [user, setUser] = useState<User | null>(null);
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.getUser();
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUser();
    }, []);

    const handleProfileUpdate = async (data: UpdateProfileBody) => {
        // 해당 함수는 모달창에서 실행되고, API 오류에 대한 안내를 모달창에서 진행해야하므로 try~catch문으로 묶지않음
        // 모달창에서 호출할 때 try~catch로 묶어 API 오류에 대한 안내를 보여주도록 함
        const response = await api.updateProfile(data);
        setUser(response.data);
        setAuthUser(response.data);
    };

    if (!user) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <div className="relative">
                    <ProfileAvatar profileImageUrl={user.profileImageUrl} nickname={user.nickname} size="xl" />
                    <div
                        onClick={() => setIsProfileEditOpen(true)}
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform border"
                        style={{ background: "#ffffff" }}>
                        <SettingIcon />
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl mb-2">{user.name}</h1>
                    <p className="text-xl text-gray-600 mb-3">@{user.nickname}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-6">
                        <span>{user.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-6 mb-6">
                        <div className="flex gap-2 text-center">
                            <div className="text-sm text-gray-600">상담</div>
                            <div className="text-sm font-bold">{user.consultationCount}</div>
                        </div>
                        <div className="flex gap-2 text-center">
                            <div className="text-sm text-gray-600">게시글</div>
                            <div className="text-sm font-bold">{user.postCount}</div>
                        </div>
                        <div className="flex gap-2 text-center">
                            <div className="text-sm text-gray-600">댓글</div>
                            <div className="text-sm font-bold">{user.commentCount}</div>
                        </div>
                    </div>
                </div>
            </div>
            <MyPets />
            <ProfileEditModal
                isOpen={isProfileEditOpen}
                onClose={() => setIsProfileEditOpen(false)}
                onSubmit={handleProfileUpdate}
                currentNickname={user.nickname}
                currentImage={user.profileImageUrl}
            />
        </div>
    );
}
