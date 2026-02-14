import { notFound } from "next/navigation";

import { Chat } from "@/components/ai-consultation/Chat";

interface Props {
    params: Promise<{ consultationId: string }>;
}

export default async function ChatPage({ params }: Props) {
    const { consultationId } = await params;

    if (isNaN(Number(consultationId))) {
        notFound();
    }

    return <Chat consultationId={Number(consultationId)} />;
}
