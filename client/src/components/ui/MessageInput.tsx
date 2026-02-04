"use client";

import { useEffect, useRef } from "react";

interface MessageInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onCancel?: () => void;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
}

export function MessageInput({
    value,
    onChange,
    onSubmit,
    onCancel,
    placeholder = "댓글을 입력하세요...",
    disabled = false,
    maxLength,
}: MessageInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isOverLimit = maxLength !== undefined && value.length > maxLength;

    const prevHeightRef = useRef<number>(0);

    // textarea 높이 자동 조절 및 스크롤
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const newHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${newHeight}px`;

            // 높이가 실제로 변경되었을 때만 스크롤
            if (prevHeightRef.current !== 0 && newHeight !== prevHeightRef.current) {
                textareaRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
            prevHeightRef.current = newHeight;
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // 한글의 경우 keydown 이벤트가 두번씩 실행되는 오류가 있어서 해당 분기문이 필수로 필요
        if (e.nativeEvent.isComposing) return;

        const isSubmitKey = e.key === "Enter" && !e.shiftKey;
        if (!isSubmitKey) return;

        e.preventDefault();

        if (isOverLimit) {
            alert(`최대 ${maxLength}자까지 작성할 수 있어요.`);
            return;
        }

        onSubmit();
    };

    return (
        <div
            className={`flex-1 border rounded-lg  transition-all overflow-hidden ${
                isOverLimit
                    ? "border-red-400 focus-within:ring-2 focus-within:ring-red-200"
                    : "border-gray-200 focus-within:ring-2 focus-within:ring-pink-200"
            }`}>
            <textarea
                ref={textareaRef}
                disabled={disabled}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full resize-none focus:outline-none overflow-hidden px-4 pt-3 pb-1 text-sm leading-relaxed bg-transparent"
                rows={3}
                style={{ minHeight: "60px", maxHeight: "200px" }}
                onKeyDown={handleKeyDown}
            />
            <div className="flex items-end justify-end px-3 py-2 gap-1">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="text-xs text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100 transition-colors px-4 py-2.5">
                        취소
                    </button>
                )}
                <div className="flex flex-col items-end gap-1.5">
                    {maxLength !== undefined && (
                        <span className={`text-xs ${value.length > 0 ? "" : "invisible"} ${isOverLimit ? "text-red-500" : "text-gray-400"}`}>
                            {value.length}/{maxLength}
                        </span>
                    )}
                    <button
                        onClick={onSubmit}
                        disabled={!value.trim() || disabled || isOverLimit}
                        className="text-xs text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5"
                        style={{ backgroundColor: "#FF6B9D" }}>
                        등록
                    </button>
                </div>
            </div>
        </div>
    );
}
