import Image from "next/image";

import { PROFILE_AVATAR_GRADIENTS, PROFILE_AVATAR_SIZE_CLASS } from "@/constants/style";

interface ProfileAvatarProps {
    profileImageUrl?: string | null;
    nickname: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export function ProfileAvatar({ profileImageUrl, nickname, size = "md" }: ProfileAvatarProps) {
    const getGradientFromNickname = (name: string): string => {
        const charCode = name.charCodeAt(0);
        const index = charCode % PROFILE_AVATAR_GRADIENTS.length;
        return PROFILE_AVATAR_GRADIENTS[index];
    };

    const firstChar = nickname.charAt(0).toUpperCase();
    const gradient = getGradientFromNickname(nickname);

    return profileImageUrl ? (
        <div className={`${PROFILE_AVATAR_SIZE_CLASS[size]} rounded-full overflow-hidden flex-shrink-0`}>
            <Image src={profileImageUrl} alt={nickname} className="w-full h-full object-cover" />
        </div>
    ) : (
        <div
            className={`${PROFILE_AVATAR_SIZE_CLASS[size]} ${gradient} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
            {firstChar}
        </div>
    );
}
