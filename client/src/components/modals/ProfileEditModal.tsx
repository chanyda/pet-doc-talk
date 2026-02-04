"use client";

import CancelIcon from "public/icons/cancel-icon.svg";
import UploadIcon from "public/icons/upload-icon.svg";
import { useRef, useState } from "react";

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { nickname: string; image: File | null }) => void;
    currentNickname: string;
    currentImage?: string | null;
}

export function ProfileEditModal({ isOpen, onClose, onSubmit, currentNickname, currentImage }: ProfileEditModalProps) {
    const [nickname, setNickname] = useState(currentNickname);
    const [imagePreview, setImagePreview] = useState<string | null>(currentImage || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleImageSelect(file);
        }
    };

    const handleSubmit = () => {
        if (!nickname.trim()) {
            alert("닉네임을 입력해주세요.");
            return;
        }
        if (nickname.trim().length < 2) {
            alert("닉네임은 최소 2자 이상이어야 합니다.");
            return;
        }

        onSubmit({ nickname: nickname.trim(), image: imageFile });
        handleClose();
    };

    const handleClose = () => {
        setNickname(currentNickname);
        setImagePreview(currentImage || null);
        setImageFile(null);
        setIsDragging(false);
        onClose();
    };

    if (!isOpen) return null;

    const isValid = nickname.trim().length >= 2;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header - PetRegistrationModal과 동일한 디자인 */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 rounded-t-3xl z-1">
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={handleClose}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
                            <CancelIcon />
                        </button>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                                프로필 수정
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">프로필을 꾸며보세요</h3>
                        <p className="text-base text-gray-600">나를 표현할 수 있는 사진과 닉네임을 설정해주세요</p>
                    </div>

                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-40 h-40 rounded-full cursor-pointer group">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="프로필 미리보기"
                                    className="w-full h-full object-cover rounded-full border-4 border-pink-200"
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
                                    background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
                                }}>
                                <UploadIcon fill="#ffffff" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                            클릭하거나 드래그해서 사진을 업로드하세요
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* Nickname */}
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">
                            닉네임 <span className="text-pink-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="닉네임을 입력하세요"
                                maxLength={20}
                                className="w-full px-5 py-4 pr-16 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                {nickname.length}/20
                            </span>
                        </div>
                        {nickname.trim().length > 0 && nickname.trim().length < 2 && (
                            <p className="text-xs text-red-500 mt-2">닉네임은 최소 2자 이상이어야 합니다</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-base">
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid}
                            className={`flex-1 px-6 py-4 text-white rounded-xl transition-all font-medium text-base ${
                                isValid
                                    ? "bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500"
                                    : "bg-gray-300 cursor-not-allowed"
                            }`}>
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
