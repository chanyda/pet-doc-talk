import { formatTo24HourTime } from "@/utils/date";
import { getMessageDisplayText, parseAIMessageContent } from "@/utils/message";

import { AIAvatar } from "../ui/AIAvatar";
import { StyledButton } from "../ui/StyledButton";

interface ChatMessageProps {
    message: Message;
    isLastMessage: boolean;
    isStreaming: boolean;
    checkListAnswers: Record<number, Record<number, string>>;
    onCheckListSelect: (messageId: number, questionIndex: number, answer: string) => void;
    onCheckListSubmit: (messageId: number, checkList: CheckListItem[]) => void;
}

export function ChatMessage({
    message,
    isLastMessage,
    isStreaming,
    checkListAnswers,
    onCheckListSelect,
    onCheckListSubmit,
}: ChatMessageProps) {
    const aiContent = parseAIMessageContent(message);

    const shouldShowCheckList = aiContent && aiContent.checkList && aiContent.checkList.length > 0;
    const isInteractive = isLastMessage;

    return (
        <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[95%] sm:max-w-[85%] md:max-w-[80%]">
                {message.role === "assistant" && <AIAvatar />}
                <div
                    className={`rounded-2xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base ${
                        message.role === "user"
                            ? "bg-linear-to-r from-pink-500 to-orange-400 text-white"
                            : "bg-white border-2 border-gray-100"
                    }`}>
                    <p className="whitespace-pre-wrap break-words">{getMessageDisplayText(message)}</p>
                    {shouldShowCheckList && (
                        <div className="mt-4 space-y-3">
                            {aiContent.checkList.map((item, idx) => {
                                const selectedAnswer = checkListAnswers[message.id]?.[idx];

                                return (
                                    <div key={idx} className="p-2.5 md:p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs md:text-sm font-medium text-gray-900 mb-2">{item.question}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.status.map((option, optIdx) => {
                                                const isSelected = selectedAnswer === option;

                                                return isInteractive ? (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => onCheckListSelect(message.id, idx, option)}
                                                        className={`px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm rounded-full transition-all min-h-9 cursor-pointer ${
                                                            isSelected
                                                                ? "bg-linear-to-r from-pink-500 to-orange-400 text-white border-2 border-pink-500"
                                                                : "bg-white border border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50"
                                                        }`}>
                                                        {option}
                                                    </button>
                                                ) : (
                                                    <span
                                                        key={optIdx}
                                                        className="px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm bg-white border border-gray-200 rounded-full text-gray-400 cursor-not-allowed">
                                                        {option}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                            {isInteractive && (
                                <StyledButton
                                    onClick={() => onCheckListSubmit(message.id, aiContent!.checkList)}
                                    disabled={isStreaming}
                                    className="w-full mt-2">
                                    답변 전송
                                </StyledButton>
                            )}
                        </div>
                    )}
                </div>
                <p className={`text-xs text-gray-500 mt-1 ${message.role === "user" ? "text-right" : "text-left"}`}>
                    {formatTo24HourTime(message.createdAt)}
                </p>
            </div>
        </div>
    );
}
