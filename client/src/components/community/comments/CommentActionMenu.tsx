"use client";

import MoreVerticalIcon from "public/icons/more-vertical-icon.svg";

interface CommentActionMenuProps {
    isOpen: boolean;
    onClick: (action: CommentActionMenuClickType) => void;
    onToggle: () => void;
    onClose: () => void;
    isAuthor: boolean;
    menuRef: React.RefObject<HTMLDivElement | null>;
}

export function CommentActionMenu({ isOpen, onClick, onToggle, onClose, isAuthor, menuRef }: CommentActionMenuProps) {
    const handleMenuClick = (action: CommentActionMenuClickType) => {
        onClick(action);
        onClose();
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={onToggle} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVerticalIcon />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                        onClick={() => handleMenuClick("reply")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        답글 달기
                    </button>
                    {isAuthor && (
                        <>
                            <button
                                onClick={() => handleMenuClick("edit")}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                수정
                            </button>
                            <button
                                onClick={() => handleMenuClick("delete")}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                                삭제
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
