"use client";

import { notFound, useRouter } from "next/navigation";
import ArrowLeftIcon from "public/icons/arrow-left-icon.svg";
import DeleteIcon from "public/icons/delete-icon.svg";
import SendIcon from "public/icons/send-icon.svg";
import StopIcon from "public/icons/stop-icon.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { DEFAULT_MESSAGE_LIMIT } from "@/constants/common";
import { useConfirm } from "@/hooks/useConfirm";
import * as api from "@/lib/api";
import { usePointStore } from "@/store/pointStore";

import { LoadingSpinner } from "../ui/LoadingSpinner";
import { StyledButton } from "../ui/StyledButton";
import { ChatMessage } from "./ChatMessage";
import { StreamingMessage } from "./StreamingMessage";

interface ChatProps {
    consultationId: number;
}

export function Chat({ consultationId }: ChatProps) {
    const router = useRouter();

    const { points, fetchPoints, decrement: decrementPoint } = usePointStore();
    const { confirmState, confirm } = useConfirm();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [streamingContent, setStreamingContent] = useState<AIMessageContent | null>(null);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [totalMessageCount, setTotalMessageCount] = useState<number>(0);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [checkListAnswers, setCheckListAnswers] = useState<Record<number, Record<number, string>>>({});
    const [isNotFoundError, setNotFoundError] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const observerTarget = useRef<HTMLDivElement | null>(null);
    const isInitialLoadRef = useRef<boolean>(true);
    const shouldAutoScrollRef = useRef<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchMessages = useCallback(
        async (cursor?: number) => {
            try {
                setIsLoadingMessages(true);

                const query: PaginationQuery = { limit: DEFAULT_MESSAGE_LIMIT };

                if (cursor !== undefined) {
                    query.cursor = cursor;
                }

                const { data } = await api.getMessages(consultationId, query);

                setMessages((prev) => {
                    const newMessages = [...data.messages].reverse();
                    return cursor !== undefined ? [...newMessages, ...prev] : newMessages;
                });
                setNextCursor(data.nextCursor);
                setTotalMessageCount(data.totalMessageCount);

                // 초기 로드 시에만 자동 스크롤 플래그 설정
                if (cursor === undefined && data.messages.length > 0) {
                    shouldAutoScrollRef.current = true;
                }
            } catch (error: unknown) {
                console.error("Failed to load more messages:", error);
                toast.error("메시지를 불러오는데 실패했습니다.");

                if (typeof error === "object" && error && "status" in error && error.status === 404) {
                    setNotFoundError(true);
                }
            } finally {
                setIsLoadingMessages(false);
            }
        },
        [consultationId],
    );

    useEffect(() => {
        isInitialLoadRef.current = true;
        shouldAutoScrollRef.current = false;

        fetchMessages();
        fetchPoints();

        return () => {
            setMessages([]);
            setStreamingContent(null);
            setCheckListAnswers({});
            abortControllerRef.current?.abort();
        };
    }, [consultationId, fetchMessages]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                const hasMoreMessages = messages.length < totalMessageCount && nextCursor !== null;

                if (hasMoreMessages && target.isIntersecting && !isLoadingMessages) {
                    // 스크롤 위치 보존을 위해 현재 높이 저장
                    const previousScrollHeight = containerRef.current?.scrollHeight || 0;

                    fetchMessages(nextCursor).then(() => {
                        // 과거 메시지 로드 후 스크롤 위치 조정
                        if (containerRef.current) {
                            const newScrollHeight = containerRef.current.scrollHeight;
                            containerRef.current.scrollTop = newScrollHeight - previousScrollHeight;
                        }
                    });
                }
            },
            { threshold: 0.1 },
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [nextCursor, isLoadingMessages, fetchMessages, messages.length, totalMessageCount]);

    useEffect(() => {
        if (shouldAutoScrollRef.current && messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
            shouldAutoScrollRef.current = false;
            isInitialLoadRef.current = false;
        }
    }, [messages]);

    useEffect(() => {
        // AI가 답변을 하고 있을 때 자동 스크롤 처리한다.
        if (streamingContent || isStreaming) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [streamingContent, isStreaming]);

    const handleCheckListSelect = (messageId: number, questionIndex: number, answer: string) => {
        setCheckListAnswers((prev) => ({
            ...prev,
            [messageId]: {
                ...prev[messageId],
                [questionIndex]: answer,
            },
        }));
    };

    const handleCheckListSubmit = async (messageId: number, checkList: CheckListItem[]) => {
        const answers = checkListAnswers[messageId];

        if (!answers || Object.keys(answers).length === 0) {
            toast.warning("최소 1개 이상의 질문에 답변해주세요.");
            return;
        }

        const formattedAnswers = checkList
            .map((item, index) => {
                const answer = answers[index];
                if (answer) {
                    return `${item.question}: ${answer}`;
                }
                return null;
            })
            .filter(Boolean)
            .join("\n");

        if (!formattedAnswers) {
            toast.warning("최소 1개 이상의 질문에 답변해주세요.");
            return;
        }

        setInputValue(formattedAnswers);
        setCheckListAnswers((prev) => {
            const newAnswers = { ...prev };
            delete newAnswers[messageId];
            return newAnswers;
        });

        await handleSend(formattedAnswers);
    };

    const handleSend = async (customContent?: string) => {
        const messageContent = customContent || inputValue.trim();

        if (!messageContent || isStreaming) return;

        if (points <= 0) {
            toast.error("포인트가 부족합니다.");
            return;
        }

        const userMessage: Message = {
            id: Date.now(), // 임시 ID
            consultationId,
            role: "user",
            content: messageContent,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsStreaming(true);
        setStreamingContent(null);

        shouldAutoScrollRef.current = true;

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const response = await fetch(`${api.API_BASE_URL}/consultations/${consultationId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content: messageContent }),
                signal: abortController.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("Response body is not readable");
            }

            let accumulatedAnswer = "";
            let currentCheckList: CheckListItem[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);

                        try {
                            const event: SSEEvent = JSON.parse(data);

                            if (event.type === "delta") {
                                // 서버에서 JSON string으로 보냄 → 파싱 필요
                                try {
                                    const content: AIMessageContent = JSON.parse(event.message.content);

                                    accumulatedAnswer = content.answer;
                                    currentCheckList = content.checkList;

                                    setStreamingContent({
                                        answer: accumulatedAnswer,
                                        checkList: currentCheckList,
                                    });
                                } catch {
                                    console.warn("⚠️ JSON parsing in progress, skipping this chunk");
                                    // JSON이 완성되지 않은 경우 무시 (다음 chunk에서 완성될 것)
                                }
                            } else if (event.type === "done") {
                                setMessages((prev) => [...prev, event.message]);
                                setStreamingContent(null);
                                decrementPoint();

                                shouldAutoScrollRef.current = true;
                            } else if (event.type === "error") {
                                console.error("❌ SSE error:", event.message);
                                toast.error("메시지 전송 중 오류가 발생했습니다.");
                            }
                        } catch (parseError) {
                            console.error("❌ Failed to parse SSE data:", data, parseError);
                        }
                    }
                }
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                // 사용자가 직접 중단 — 에러 처리 불필요
                return;
            }
            console.error("Message send error:", error);
            toast.error("메시지 전송에 실패했습니다. 다시 시도해주세요.");
        } finally {
            abortControllerRef.current = null;
            setIsStreaming(false);
            setStreamingContent(null);
        }
    };

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: "상담 삭제",
            message: "이 상담을 삭제하시겠습니까? 삭제된 상담은 복구할 수 없습니다.",
            confirmText: "삭제",
            cancelText: "취소",
            variant: "danger",
        });

        if (!confirmed) return;

        try {
            await api.deleteConsultation(consultationId);
            toast.success("상담이 삭제되었습니다.");
            router.push("/ai-consultation");
        } catch {
            toast.error("상담 삭제에 실패했습니다.");
        }
    };

    const handleAbort = () => {
        if (!abortControllerRef.current) return;
        abortControllerRef.current.abort();

        // done 이벤트는 도달하지 않으므로 현재 streamingContent를 직접 메시지로 표시
        if (streamingContent) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    consultationId,
                    role: "assistant",
                    content: JSON.stringify(streamingContent),
                    createdAt: new Date().toISOString(),
                },
            ]);
        }
    };

    if (isNotFoundError) {
        notFound();
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {confirmState && (
                <ConfirmModal
                    isOpen={confirmState.isOpen}
                    title={confirmState.title}
                    message={confirmState.message}
                    confirmText={confirmState.confirmText}
                    cancelText={confirmState.cancelText}
                    variant={confirmState.variant}
                    onConfirm={confirmState.onConfirm}
                    onCancel={confirmState.onCancel}
                />
            )}
            <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 md:py-4 flex items-center gap-2 md:gap-3">
                <button
                    onClick={() => router.push("/ai-consultation")}
                    className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                    <ArrowLeftIcon width="24px" height="24px" className="md:w-[30px] md:h-[30px]" />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-base md:text-lg font-semibold text-gray-900">AI 상담</h1>
                    <p className="text-xs md:text-sm text-gray-600 truncate">AI 수의사와 상담중</p>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-linear-to-r from-pink-50 to-orange-50 rounded-full border border-pink-200 shrink-0">
                    <span className="text-xs md:text-sm text-gray-600 hidden sm:inline">포인트</span>
                    <span className="text-sm md:text-lg font-bold text-pink-500">{points}</span>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={isStreaming}
                    className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors text-gray-400 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    title="상담 삭제">
                    <DeleteIcon />
                </button>
            </div>
            <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                <div ref={observerTarget} style={{ height: "1px" }} />
                {isLoadingMessages && <LoadingSpinner />}
                {messages.map((message, index) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                        isLastMessage={index === messages.length - 1}
                        isStreaming={isStreaming}
                        checkListAnswers={checkListAnswers}
                        onCheckListSelect={handleCheckListSelect}
                        onCheckListSubmit={handleCheckListSubmit}
                    />
                ))}
                {isStreaming && <StreamingMessage content={streamingContent} />}
                <div ref={messagesEndRef} />
            </div>
            <div className="bg-white border-t border-gray-200 p-3 md:p-4">
                <div className="flex gap-2 md:gap-3">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="메시지를 입력하세요..."
                        disabled={isStreaming}
                        rows={1}
                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 resize-none disabled:bg-gray-100"
                        style={{ minHeight: "44px", maxHeight: "120px" }}
                    />
                    {isStreaming ? (
                        <StyledButton onClick={handleAbort} className="shrink-0">
                            <StopIcon />
                        </StyledButton>
                    ) : (
                        <StyledButton onClick={() => handleSend()} disabled={!inputValue.trim() || points <= 0} className="shrink-0">
                            <SendIcon />
                        </StyledButton>
                    )}
                </div>
            </div>
        </div>
    );
}
