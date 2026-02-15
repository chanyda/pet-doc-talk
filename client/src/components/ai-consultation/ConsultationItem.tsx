import Image from "next/image";
import ArrowRightIcon from "public/icons/arrow-right-icon.svg";
import CatFaceIcon from "public/icons/cat-face-icon.svg";
import DogFaceIcon from "public/icons/dog-face-icon.svg";

import { formatLocalDateTime } from "@/utils/date";

interface ConsultationItemProps {
    consultation: ConsultationItem;
    onClick: (consultationId: number) => void;
}

export function ConsultationItem({ consultation, onClick }: ConsultationItemProps) {
    return (
        <div
            key={consultation.id}
            onClick={() => onClick(consultation.id)}
            className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span>
                        {consultation.pet.imageUrl ? (
                            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-md shrink-0">
                                <Image src={consultation.pet.imageUrl} alt={consultation.pet.name} />
                            </div>
                        ) : (
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-3 border-white shadow-md shrink-0"
                                style={{
                                    background: "var(--brand-gradient)",
                                }}>
                                {consultation.pet.type === "CAT" ? (
                                    <CatFaceIcon width="30px" height="30px" />
                                ) : (
                                    <DogFaceIcon width="30px" height="30px" />
                                )}
                            </div>
                        )}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{consultation.pet.name}</h3>
                    </div>
                    <p className="text-gray-700 mb-3 line-clamp-1">{consultation.title || "새로운 상담"}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">{formatLocalDateTime(consultation.createdAt)}</span>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <ArrowRightIcon width="30px" height="30px" />
                </div>
            </div>
        </div>
    );
}
