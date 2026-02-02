"use client";

import SendIcon from "public/icons/send-icon.svg";
import { useEffect, useRef } from "react";

interface MessageInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
}

export function MessageInput({
    value,
    onChange,
    onSubmit,
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
        <div className={"flex flex-col gap-1 flex-1"}>
            <div className="flex gap-2 items-center">
                <textarea
                    ref={textareaRef}
                    disabled={disabled}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`flex-1 px-4 border rounded-xl resize-none focus:outline-none focus:ring-2 transition-all overflow-hidden py-2.5 ${
                        isOverLimit ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-pink-200"
                    }`}
                    rows={1}
                    style={{ minHeight: "42px", maxHeight: "120px" }}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={onSubmit}
                    disabled={!value.trim() || disabled || isOverLimit}
                    className={
                        "text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 flex-shrink-0"
                    }
                    style={{ backgroundColor: "#FF6B9D", minHeight: "42px" }}>
                    <SendIcon />
                </button>
            </div>
            {maxLength !== undefined && value.length > 0 && (
                <span className={`text-xs text-right ${isOverLimit ? "text-red-500" : "text-gray-400"}`}>
                    {value.length}/{maxLength}
                </span>
            )}
        </div>
    );
}
