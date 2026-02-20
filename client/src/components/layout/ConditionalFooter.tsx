"use client";

import { usePathname } from "next/navigation";

import { Footer } from "./Footer";

export function ConditionalFooter() {
    const pathname = usePathname();
    const isChatPage = /^\/ai-consultation\/\d+$/.test(pathname);

    // 채팅방에서는 Footer 숨기기
    if (isChatPage) {
        return null;
    }

    return <Footer />;
}
