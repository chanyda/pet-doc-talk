"use client";

import { createContext, useContext } from "react";

interface CommentActionContextType {
    activeAction: CommentActiveAction | null;
    setActiveAction: (action: CommentActiveAction | null) => void;
    cancelAction: () => void;
}

const CommentActionContext = createContext<CommentActionContextType | null>(null);

export function CommentActionProvider({
    activeAction,
    setActiveAction,
    children,
}: {
    activeAction: CommentActiveAction | null;
    setActiveAction: (action: CommentActiveAction | null) => void;
    children: React.ReactNode;
}) {
    return (
        <CommentActionContext.Provider
            value={{
                activeAction,
                setActiveAction,
                cancelAction: () => setActiveAction(null),
            }}>
            {children}
        </CommentActionContext.Provider>
    );
}

export function useCommentAction() {
    const context = useContext(CommentActionContext);
    if (!context) {
        throw new Error("useCommentAction must be used within a CommentActionProvider");
    }
    return context;
}
