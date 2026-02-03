"use client";

import CatFaceIcon from "public/icons/cat-face-icon.svg";
import DogFaceIcon from "public/icons/dog-face-icon.svg";
import { useRef, useState } from "react";

interface PetRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (petData: any) => void;
}

export function PetRegistrationModal({ isOpen, onClose, onSubmit }: PetRegistrationModalProps) {
    const [step, setStep] = useState(1);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form data
    const [formData, setFormData] = useState({
        image: null as File | null,
        name: "",
        category: "" as "" | "강아지" | "고양이",
        gender: "" as "" | "남" | "여",
        isNeutered: false,
        breed: "",
        weight: "",
        birthday: "",
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNext = () => {
        // Validate step 1
        if (!formData.name || !formData.category || !formData.gender) {
            alert("필수 항목을 모두 입력해주세요");
            return;
        }
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = () => {
        // Validate step 2
        if (!formData.breed) {
            alert("품종을 입력해주세요");
            return;
        }
        onSubmit(formData);
        handleClose();
    };

    const handleClose = () => {
        setStep(1);
        setFormData({
            image: null,
            name: "",
            category: "",
            gender: "",
            isNeutered: false,
            breed: "",
            weight: "",
            birthday: "",
        });
        setImagePreview(null);
        onClose();
    };

    if (!isOpen) return null;

    const isStep1Valid = formData.name && formData.category && formData.gender;
    const isStep2Valid = formData.breed;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 rounded-t-3xl z-1">
                    <div className="relative">
                        <button
                            onClick={handleClose}
                            className="absolute right-0 top-0 w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors">
                            X
                        </button>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                                우리아이 등록
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    {step === 1 ? (
                        <div className="space-y-8">
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
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="예) 뽀미"
                                    className="w-full px-5 py-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-3">
                                    종류 <span className="text-pink-600">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: "강아지" })}
                                        className={`py-4 rounded-xl border-2 transition-all ${
                                            formData.category === "강아지"
                                                ? "border-pink-400 bg-pink-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}>
                                        <div className="flex items-center justify-center gap-3">
                                            <DogFaceIcon width="40px" height="40px" />
                                            <div className="font-medium text-base text-gray-900">강아지</div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: "고양이" })}
                                        className={`py-4 rounded-xl border-2 transition-all ${
                                            formData.category === "고양이"
                                                ? "border-pink-400 bg-pink-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="text-4xl">
                                                <CatFaceIcon width="40px" height="40px" />
                                            </div>
                                            <div className="font-medium text-base text-gray-900">고양이</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-3">
                                    성별 <span className="text-pink-600">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: "남" })}
                                        className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all ${
                                            formData.gender === "남"
                                                ? "border-blue-400 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}>
                                        <div className="text-3xl">♂️</div>
                                        <div className="font-medium text-base text-gray-900">남아</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: "여" })}
                                        className={`flex items-center justify-center gap-3 py-4 rounded-xl border-2 transition-all ${
                                            formData.gender === "여"
                                                ? "border-pink-400 bg-pink-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}>
                                        <div className="text-3xl">♀️</div>
                                        <div className="font-medium text-base text-gray-900">여아</div>
                                    </button>
                                </div>
                            </div>

                            {/* Neutered */}
                            <div>
                                <label className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.isNeutered}
                                        onChange={(e) => setFormData({ ...formData, isNeutered: e.target.checked })}
                                        className="w-6 h-6 text-pink-600 rounded focus:ring-pink-500"
                                    />
                                    <div className="flex-1">
                                        <span className="font-medium text-base text-gray-900">중성화 완료</span>
                                        <p className="text-sm text-gray-500 mt-1">
                                            중성화 수술을 받았다면 체크해주세요
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Step 2 Title */}
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {`${formData.name ?? ""}의 `}상세 정보를 알려주세요.
                                </h3>
                                <p className="text-base text-gray-600">더 자세한 정보를 입력해주세요.</p>
                            </div>

                            {/* Breed */}
                            <div className="flex flex-col items-center">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-40 h-40 rounded-full cursor-pointer group">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-full border-4 border-pink-200"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-pink-100 to-orange-100 rounded-full border-4 border-dashed border-pink-300 flex flex-col items-center justify-center group-hover:border-pink-400 transition-colors">
                                            {/* <UploadIcon size={32} className="text-pink-400 mb-2" /> */}
                                            <span className="text-sm text-gray-600">사진 (선택)</span>
                                        </div>
                                    )}
                                    <div
                                        className="absolute bottom-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-3 border-white"
                                        style={{
                                            background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
                                        }}>
                                        {/* <UploadIcon size={18} className="text-white" /> */}
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
                                <input
                                    type="text"
                                    value={formData.breed}
                                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                                    placeholder={
                                        formData.category === "강아지"
                                            ? "예) 웰시코기, 골든리트리버"
                                            : "예) 코리안숏헤어, 러시안블루"
                                    }
                                    className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 focus:bg-pink-50 transition-all"
                                />
                            </div>

                            {/* Weight */}
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-3">몸무게 (선택)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        placeholder="예) 12.5"
                                        className="w-full px-5 py-4 pr-16 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 focus:bg-pink-50 transition-all"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-base text-gray-500">
                                        kg
                                    </span>
                                </div>
                            </div>

                            {/* Birthday */}
                            <div>
                                <label className="block text-base font-medium text-gray-700 mb-3">생일 (선택)</label>
                                <input
                                    type="date"
                                    value={formData.birthday}
                                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                    className="w-full px-5 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 focus:bg-pink-50 transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-10">
                        {step === 2 && (
                            <button
                                onClick={handleBack}
                                className="px-8 py-4 text-base bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
                                {/* <ChevronLeftIcon size={22} /> */}
                                <span>이전</span>
                            </button>
                        )}
                        {step === 1 ? (
                            <button
                                onClick={handleNext}
                                disabled={!isStep1Valid}
                                className="flex-1 px-8 py-4 text-base text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                style={{
                                    background: isStep1Valid
                                        ? "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)"
                                        : "#d1d5db",
                                }}>
                                <span>다음</span>
                                {/* <ChevronRightIcon size={22} /> */}
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!isStep2Valid}
                                className="flex-1 px-8 py-4 text-base text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                style={{
                                    background: isStep2Valid
                                        ? "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)"
                                        : "#d1d5db",
                                }}>
                                {/* <CheckIcon size={22} /> */}
                                <span>등록 완료</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
