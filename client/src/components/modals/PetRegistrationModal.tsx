"use client";

import ArrowDownIcon from "public/icons/arrow-down-icon.svg";
import ArrowLeftIcon from "public/icons/arrow-left-icon.svg";
import ArrowRightIcon from "public/icons/arrow-right-icon.svg";
import ArrowUpIcon from "public/icons/arrow-up-icon.svg";
import CancelIcon from "public/icons/cancel-icon.svg";
import CatFaceIcon from "public/icons/cat-face-icon.svg";
import DogFaceIcon from "public/icons/dog-face-icon.svg";
import UploadIcon from "public/icons/upload-icon.svg";
import { useRef, useState } from "react";

import { catBreeds, dogBreeds } from "@/constants/pet";
import { useOutsideClick } from "@/hooks/useClickOutside";

interface PetRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (petData: PetRegistrationFormData) => void;
    onDelete: () => void;
    initialFormData?: Partial<PetRegistrationFormData>;
    isEditMode?: boolean;
}

const defaultFormData: Partial<PetRegistrationFormData> = {
    name: "",
    breed: "",
};

export function PetRegistrationModal({
    isOpen,
    onClose,
    onSubmit,
    onDelete,
    initialFormData = defaultFormData,
    isEditMode = false,
}: PetRegistrationModalProps) {
    const [formData, setFormData] = useState<Partial<PetRegistrationFormData>>(initialFormData);
    const [step, setStep] = useState<number>(1);
    const [isBreedSelectOpen, setIsBreedSelectOpen] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const breedDropdownRef = useOutsideClick(() => setIsBreedSelectOpen(false));

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        // TODO: 사진 처리하는 거 추가하기
        // const file = e.target.files?.[0];
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         const result = reader.result as string;
        //         setImagePreview(result);
        //         setFormData({ ...formData, imageUrl: result });
        //     };
        //     reader.readAsDataURL(file);
        // }
    };

    const handleNext = () => {
        if (!formData.name || !formData.type || !formData.gender) {
            alert("필수 항목을 모두 입력해 주세요.");
            return;
        }
        setStep(2);
    };

    const handleSubmit = () => {
        if (!formData.breed) {
            alert("품종을 입력해 주세요.");
            return;
        }
        onSubmit(formData as PetRegistrationFormData);
        handleClose();
    };

    const handleClose = () => {
        setStep(1);
        setFormData(initialFormData);
        onClose();
    };

    if (!isOpen) return null;

    const isStepOneValid = formData.name && formData.type && formData.gender;
    const isStepTwoValid = formData.breed;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 rounded-t-3xl z-1">
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={handleClose}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
                            <CancelIcon />
                        </button>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                                {isEditMode ? "우리 아이 수정" : "우리 아이 등록"}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    {step === 1 ? (
                        <div key="step1" className="space-y-8">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">기본 정보를 알려주세요.</h3>
                                <p className="text-base text-gray-600">우리 아이의 기본 정보를 입력해 주세요.</p>
                            </div>
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-3">
                                    이름 <span className="text-pink-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="예) 뽀미"
                                    className="w-full px-5 py-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-3">
                                    종류 <span className="text-pink-600">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: "DOG" })}
                                        disabled={isEditMode}
                                        className={`py-4 rounded-xl border-2 transition-all ${
                                            formData.type === "DOG"
                                                ? "border-pink-400 bg-pink-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        } ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}>
                                        <div className="flex items-center justify-center gap-3">
                                            <DogFaceIcon width="40px" height="40px" />
                                            <div className="font-medium text-base text-gray-900">강아지</div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: "CAT" })}
                                        disabled={isEditMode}
                                        className={`py-4 rounded-xl border-2 transition-all ${
                                            formData.type === "CAT"
                                                ? "border-pink-400 bg-pink-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        } ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}>
                                        <div className="flex items-center justify-center gap-3">
                                            <CatFaceIcon width="40px" height="40px" />
                                            <div className="font-medium text-base text-gray-900">고양이</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-3">
                                    성별 <span className="text-pink-600">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: "MALE" })}
                                        className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all ${
                                            formData.gender === "MALE"
                                                ? "border-blue-400 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}>
                                        <div className="text-3xl leading-none">♂️</div>
                                        <div className="font-medium text-base text-gray-900">남아</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                                        className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all ${
                                            formData.gender === "FEMALE"
                                                ? "border-pink-400 bg-pink-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}>
                                        <div className="text-3xl leading-none">♀️</div>
                                        <div className="font-medium text-base text-gray-900">여아</div>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.isNeutered ?? false}
                                        onChange={(e) => setFormData({ ...formData, isNeutered: e.target.checked })}
                                        className="w-6 h-6 text-pink-600 rounded focus:ring-pink-500"
                                    />
                                    <div className="flex-1">
                                        <span className="font-medium text-base text-gray-900">중성화 완료</span>
                                        <p className="text-sm text-gray-500 mt-1">
                                            중성화 수술을 받았다면 체크해주세요.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div key="step2" className="space-y-8">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    <span style={{ color: "#FF6B9D" }}>{`${formData.name ?? "아이"}`}</span>의 상세
                                    정보를 알려주세요.
                                </h3>
                                <p className="text-base text-gray-600">더 자세한 정보를 입력해 주세요.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-40 h-40 rounded-full cursor-pointer group">
                                    {initialFormData.imageUrl ? (
                                        <img
                                            src={initialFormData.imageUrl}
                                            alt="Preview"
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
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-3">
                                    품종 <span className="text-pink-600">*</span>
                                </label>
                                <div className="relative" ref={breedDropdownRef}>
                                    <div
                                        onClick={() => setIsBreedSelectOpen(!isBreedSelectOpen)}
                                        className={`w-full px-5 py-4 pr-12 text-base border-2 rounded-xl cursor-pointer transition-all select-none ${
                                            isBreedSelectOpen
                                                ? "border-pink-300 bg-pink-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}>
                                        <span className={formData.breed ? "text-gray-900" : "text-gray-400"}>
                                            {formData.breed || "품종을 선택해주세요."}
                                        </span>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            {isBreedSelectOpen ? (
                                                <ArrowUpIcon width="20px" height="20px" />
                                            ) : (
                                                <ArrowDownIcon width="20px" height="20px" />
                                            )}
                                        </div>
                                    </div>
                                    {isBreedSelectOpen && (
                                        <div className="absolute z-10 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                            {(formData.type === "DOG" ? dogBreeds : catBreeds).map((breed) => (
                                                <div
                                                    key={breed}
                                                    onClick={() => {
                                                        setFormData({ ...formData, breed });
                                                        setIsBreedSelectOpen(false);
                                                    }}
                                                    className={`px-5 py-3 text-base cursor-pointer transition-colors ${
                                                        formData.breed === breed
                                                            ? "bg-pink-50 text-pink-600 font-medium"
                                                            : "text-gray-700 hover:bg-pink-50"
                                                    }`}>
                                                    {breed}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-3">몸무게 (선택)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={0.1}
                                        value={formData.weight || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === "" || Number(value) >= 0) {
                                                // 소수점 2자리까지만 허용
                                                const match = value.match(/^\d+\.?\d{0,2}/);
                                                const trimmed = match ? match[0] : value;
                                                setFormData({
                                                    ...formData,
                                                    weight: trimmed ? Number(trimmed) : null,
                                                });
                                            }
                                        }}
                                        placeholder="예) 12.5"
                                        className="w-full px-5 py-4 pr-16 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 focus:bg-pink-50 transition-all"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-base text-gray-500">
                                        kg
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-3">생일 (선택)</label>
                                <input
                                    type="date"
                                    value={formData.birthDate ? formData.birthDate.split("T")[0] : ""}
                                    max={new Date().toISOString().split("T")[0]}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            birthDate: e.target.value || null,
                                        })
                                    }
                                    className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 focus:bg-pink-50 transition-all"
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex gap-4 mt-10">
                        {step === 2 && (
                            <button
                                onClick={() => setStep(1)}
                                className="px-8 py-4 text-base bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
                                <ArrowLeftIcon width="30px" height="30px" />
                                <span>이전</span>
                            </button>
                        )}
                        {step === 1 ? (
                            <button
                                onClick={handleNext}
                                disabled={!isStepOneValid}
                                className="flex-1 px-8 py-4 text-base text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                style={{
                                    background: isStepOneValid
                                        ? "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)"
                                        : "#d1d5db",
                                }}>
                                <ArrowRightIcon width="30px" height="30px" stroke="#ffffff" />
                                <span>다음</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!isStepTwoValid}
                                className="flex-1 px-8 py-4 text-base text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                style={{
                                    background: isStepTwoValid
                                        ? "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)"
                                        : "#d1d5db",
                                }}>
                                <span>{isEditMode ? "수정 완료" : "등록 완료"}</span>
                            </button>
                        )}
                    </div>
                    {isEditMode && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    if (window.confirm("정말 삭제하시겠습니까?")) {
                                        onDelete();
                                        handleClose();
                                    }
                                }}
                                className="text-sm text-gray-400 hover:text-red-500 underline transition-colors">
                                이 아이 삭제하기
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
