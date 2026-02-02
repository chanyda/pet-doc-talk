"use client";

import SettingIcon from "public/icons/setting-icon.svg";

import { useAuthStore } from "@/store/authStore";

import { ProfileAvatar } from "../ui/ProfileAvatar";
import { MyPets } from "./MyPets";

export function Profile() {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <div className="relative">
                    <ProfileAvatar profileImageUrl={user.profileImageUrl} nickname={user.nickname} size="xl" />
                    <div
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
        </div>
    );
}
