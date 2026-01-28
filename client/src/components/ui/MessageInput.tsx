"use client";

import SendIcon from "public/icons/send-icon.svg";
import { useEffect, useRef } from "react";

interface MessageInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder?: string;
    disabled?: boolean;
}

export function MessageInput({
    value,
    onChange,
    onSubmit,
    placeholder = "댓글을 입력하세요...",
    disabled = false,
}: MessageInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // textarea 높이 자동 조절 및 스크롤
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const newHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${newHeight}px`;

            // 높이 조절 후 textarea가 화면에 다 보이도록 스크롤
            textareaRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // 한글의 경우 keydown 이벤트가 두번씩 실행되는 오류가 있어서 해당 분기문이 필수로 필요
        if (e.nativeEvent.isComposing) return;
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <div className={"flex gap-2 items-center flex-1"}>
            <textarea
                ref={textareaRef}
                disabled={disabled}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={
                    "flex-1 px-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all overflow-hidden py-2.5 rounded-xl"
                }
                rows={1}
                style={{ minHeight: "42px", maxHeight: "120px" }}
                onKeyDown={handleKeyDown}
            />
            <button
                onClick={onSubmit}
                disabled={!value.trim() || disabled}
                className={
                    "text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 flex-shrink-0"
                }
                style={{ backgroundColor: "#FF6B9D", minHeight: "42px" }}>
                <SendIcon />
            </button>
        </div>
    );
}
