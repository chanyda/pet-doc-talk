import { AIAvatar } from "../ui/AIAvatar";

interface StreamingMessageProps {
    content: AIMessageContent | null;
}

export function StreamingMessage({ content }: StreamingMessageProps) {
    return (
        <div className="flex justify-start">
            <div className="max-w-[80%]">
                <AIAvatar />
                <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-3">
                    {content ? (
                        <p className="whitespace-pre-wrap">{content.answer}</p>
                    ) : (
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
