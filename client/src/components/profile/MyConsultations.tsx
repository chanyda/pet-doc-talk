"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowRightIcon from "public/icons/arrow-right-icon.svg";
import CatFaceIcon from "public/icons/cat-face-icon.svg";
import DogFaceIcon from "public/icons/dog-face-icon.svg";

import { useConsultationList } from "@/hooks/useConsultationList";
import { formatLocalDateTime } from "@/utils/date";

import { ConsultationEmptyState } from "../ui/ConsultationEmptyState";
import { HasMoreButton } from "../ui/HasMoreButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function MyConsultations() {
    const router = useRouter();
    const { consultations, nextCursor, isLoading, totalConsultationCount, handleLoadMore } = useConsultationList();

    const handleConsultationClick = (consultationId: number) => {
        router.push(`/ai-consultation?consultationId=${consultationId}`);
    };

    const renderConsultationList = () => {
        if (consultations.length === 0 && isLoading) {
            return <LoadingSpinner />;
        }

        if (consultations.length === 0) {
            return <ConsultationEmptyState />;
        }

        return (
            <div className="space-y-3">
                {consultations.map((consultation) => (
                    <div
                        key={consultation.id}
                        onClick={() => handleConsultationClick(consultation.id)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-pink-200 p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                {consultation.pet.imageUrl ? (
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                                        <Image
                                            src={consultation.pet.imageUrl}
                                            alt={consultation.pet.name}
                                            width={56}
                                            height={56}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                                        style={{
                                            background: "var(--brand-gradient)",
                                        }}>
                                        {consultation.pet.type === "CAT" ? (
                                            <CatFaceIcon width="28px" height="28px" />
                                        ) : (
                                            <DogFaceIcon width="28px" height="28px" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{consultation.pet.name}</h3>
                                <p className="text-gray-700 mb-2 line-clamp-1">{consultation.title || "새로운 상담"}</p>
                                <div className="text-sm text-gray-500">
                                    {formatLocalDateTime(consultation.createdAt)}
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <ArrowRightIcon width="24px" height="24px" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl mb-1">내 상담 내역</h3>
            </div>
            {renderConsultationList()}
            {nextCursor && consultations.length < totalConsultationCount && (
                <HasMoreButton isLoading={isLoading} onClick={handleLoadMore} />
            )}
        </div>
    );
}
