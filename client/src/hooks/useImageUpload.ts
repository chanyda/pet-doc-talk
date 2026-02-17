import imageCompression from "browser-image-compression";
import { useRef, useState } from "react";

import { ImageFolderType } from "@/constants/image";
import { getImageUploadUrl, uploadImageToS3 } from "@/lib/api";

export function useImageUpload(initialImage: string | null = null) {
    const [imagePreview, setImagePreview] = useState<string | null>(initialImage);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;

        const MAX_FILE_SIZE_MB = 10;
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            alert(`파일 크기는 ${MAX_FILE_SIZE_MB}MB 이하여야 합니다.`);
            e.target.value = "";
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const uploadImage = async (folder: ImageFolderType) => {
        if (!imageFile) return null;

        const compressed = await imageCompression(imageFile, { maxSizeMB: 1, maxWidthOrHeight: 800 });

        const { data } = await getImageUploadUrl(compressed.type, compressed.name, folder);
        await uploadImageToS3(data.uploadUrl, compressed);
        return data.imageUrl;
    };

    const resetImage = (image: string | null) => {
        setImagePreview(image);
        setImageFile(null);
    };

    return { imagePreview, fileInputRef, handleImageSelect, uploadImage, resetImage };
}
