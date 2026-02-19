"use client";

import Image from "next/image";
import CancelIcon from "public/icons/cancel-icon.svg";
import UploadIcon from "public/icons/upload-icon.svg";
import { useState } from "react";

import { IMAGE_FOLDER } from "@/constants/image";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateProfileBody) => Promise<void>;
    currentNickname: string;
    currentImage?: string | null;
}

export function ProfileEditModal({
    isOpen,
    onClose,
    onSubmit,
    currentNickname,
    currentImage = null,
}: ProfileEditModalProps) {
    const [nickname, setNickname] = useState<string>(currentNickname);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [nicknameErrorMessage, setNicknameErrorMessage] = useState<string | null>(null);

    const { imagePreview, fileInputRef, handleImageSelect, uploadImage, resetImage } = useImageUpload(currentImage);

    const handleSubmit = async () => {
        if (!nickname.trim()) {
            setNicknameErrorMessage("닉네임을 입력해주세요.");
            return;
        }
        if (nickname.trim().length < 2) {
            setNicknameErrorMessage("닉네임은 최소 2자 이상이어야 합니다.");
            return;
        }

        setIsLoading(true);
        setNicknameErrorMessage(null);

        try {
            const uploadImageUrl = await uploadImage(IMAGE_FOLDER.PROFILE);
            const profileImageUrl = uploadImageUrl ?? currentImage;

            await onSubmit({ nickname: nickname.trim(), profileImageUrl });
            handleClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
                // NOTE: 일단은 하드코딩 해두고 추후 error code를 넣는 형식으로 바꿔서 처리해주자.
                if (err.message.includes("This nickname is already in use.")) {
                    setNicknameErrorMessage("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
                } else {
                    setNicknameErrorMessage("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setNickname(currentNickname);
        resetImage();
        setNicknameErrorMessage(null);
        onClose();
    };

    if (!isOpen) return null;

    const isValid = nickname.trim().length >= 2;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-8 py-4 md:py-5 rounded-t-2xl md:rounded-t-3xl z-1">
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={handleClose}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
                            <CancelIcon />
                        </button>
                        <div className="text-center">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                프로필 수정
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                    <div className="text-center">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">프로필을 꾸며보세요.</h3>
                        <p className="text-sm md:text-base text-gray-600">나를 표현할 수 있는 사진과 닉네임을 설정해주세요.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full cursor-pointer group">
                            {imagePreview ? (
                                <Image
                                    src={imagePreview}
                                    alt="프로필 미리보기"
                                    fill
                                    unoptimized
                                    className="object-cover rounded-full border-4 border-pink-200"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-orange-100 rounded-full border-4 border-dashed border-pink-300 flex flex-col items-center justify-center group-hover:border-pink-400 transition-colors gap-1">
                                    <UploadIcon fill="#ff6b9d" width="35px" height="35px" />
                                    <span className="text-sm text-gray-600">사진 (선택)</span>
                                </div>
                            )}
                            <div
                                className="absolute bottom-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-3 border-white"
                                style={{
                                    background: "var(--brand-gradient)",
                                }}>
                                <UploadIcon fill="#ffffff" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center">클릭해서 사진을 업로드하세요.</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2 md:mb-3">
                            닉네임 <span className="text-pink-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => {
                                    setNickname(e.target.value);
                                    setNicknameErrorMessage(null);
                                }}
                                placeholder="닉네임을 입력하세요."
                                maxLength={20}
                                className={`w-full px-3 md:px-5 py-3 md:py-4 pr-14 md:pr-16 text-sm md:text-base border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    nicknameErrorMessage
                                        ? "border-red-400 focus:ring-red-200"
                                        : "border-gray-200 focus:ring-pink-200"
                                }`}
                            />
                            <span className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-400">
                                {nickname.length}/20
                            </span>
                        </div>
                        <p className="text-xs text-red-500 mt-2 min-h-5">
                            {nicknameErrorMessage
                                ? nicknameErrorMessage
                                : nickname.trim().length > 0 && nickname.trim().length < 2
                                  ? "닉네임은 최소 2자 이상이어야 합니다."
                                  : "\u00A0"}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50">
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid || isLoading}
                            className="flex-1 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-white rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                            style={{
                                background: isValid && !isLoading ? "var(--brand-gradient)" : "#d1d5db",
                            }}>
                            {isLoading ? "저장 중..." : "저장"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
