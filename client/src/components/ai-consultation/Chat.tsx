"use client";

import { notFound, useRouter } from "next/navigation";
import ArrowLeftIcon from "public/icons/arrow-left-icon.svg";
import SendIcon from "public/icons/send-icon.svg";
import StopIcon from "public/icons/stop-icon.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { DEFAULT_MESSAGE_LIMIT } from "@/constants/common";
import * as api from "@/lib/api";
import { formatTo24HourTime } from "@/utils/date";
import { getMessageDisplayText, parseAIMessageContent } from "@/utils/message";

import { LoadingSpinner } from "../ui/LoadingSpinner";

interface ChatProps {
    consultationId: number;
}

export function Chat({ consultationId }: ChatProps) {
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [streamingContent, setStreamingContent] = useState<AIMessageContent | null>(null);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [totalMessageCount, setTotalMessageCount] = useState<number>(0);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const [checkListAnswers, setCheckListAnswers] = useState<Record<number, Record<number, string>>>({});
    const [points, setPoints] = useState<number>(0);
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

        const fetchPoints = async () => {
            try {
                const response = await api.getMyPoints();
                setPoints(response.data.amount);
            } catch (error) {
                console.error("Failed to fetch points:", error);
            }
        };

        fetchMessages();
        fetchPoints();

        return () => {
            setMessages([]);
            setStreamingContent(null);
            setCheckListAnswers({});
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
                                setPoints((prev) => Math.max(0, prev - 1));

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
            <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
                <button
                    onClick={() => router.push("/ai-consultation")}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                    <ArrowLeftIcon width="30px" height="30px" />
                </button>
                <div className="flex-1">
                    <h1 className="font-bold text-lg text-gray-900 flex items-center gap-2">AI 상담</h1>
                    <p className="text-sm text-gray-600">AI 수의사와 상담중</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-orange-50 rounded-full border border-pink-200">
                    <span className="text-sm text-gray-600">포인트</span>
                    <span className="text-lg font-bold text-pink-500">{points}</span>
                </div>
            </div>
            <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                <div ref={observerTarget} style={{ height: "1px" }} />
                {isLoadingMessages && <LoadingSpinner />}
                {messages.map((message, index) => {
                    const aiContent = parseAIMessageContent(message);

                    // assistant 메시지인데 표시할 내용이 없으면 렌더링하지 않음
                    if (message.role === "assistant" && !aiContent) {
                        return null;
                    }

                    // 다음 메시지가 있는지 확인 (체크리스트 표시 및 interactive 여부 판단)
                    const nextMessage = messages[index + 1];
                    const shouldShowCheckList = aiContent && aiContent.checkList && aiContent.checkList.length > 0;

                    return (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%]`}>
                                {message.role === "assistant" && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400"></div>
                                        <span className="text-sm font-medium">AI 수의사</span>
                                    </div>
                                )}
                                <div
                                    className={`rounded-2xl px-4 py-3 ${
                                        message.role === "user"
                                            ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white"
                                            : "bg-white border-2 border-gray-100"
                                    }`}>
                                    <p className="whitespace-pre-wrap">{getMessageDisplayText(message)}</p>
                                    {shouldShowCheckList && (
                                        <div className="mt-4 space-y-3">
                                            {aiContent.checkList.map((item, idx) => {
                                                const selectedAnswer = checkListAnswers[message.id]?.[idx];
                                                const isInteractive = !nextMessage; // 마지막 메시지만 interactive

                                                return (
                                                    <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                                                        <p className="text-sm font-medium text-gray-900 mb-2">
                                                            {item.question}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.status.map((option, optIdx) => {
                                                                const isSelected = selectedAnswer === option;

                                                                return isInteractive ? (
                                                                    <button
                                                                        key={optIdx}
                                                                        onClick={() =>
                                                                            handleCheckListSelect(
                                                                                message.id,
                                                                                idx,
                                                                                option,
                                                                            )
                                                                        }
                                                                        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                                                                            isSelected
                                                                                ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white border-2 border-pink-500"
                                                                                : "bg-white border border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50"
                                                                        }`}>
                                                                        {option}
                                                                    </button>
                                                                ) : (
                                                                    <span
                                                                        key={optIdx}
                                                                        className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full text-gray-400 cursor-not-allowed">
                                                                        {option}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {!nextMessage && (
                                                <button
                                                    onClick={() =>
                                                        handleCheckListSubmit(message.id, aiContent!.checkList)
                                                    }
                                                    disabled={isStreaming}
                                                    className="w-full mt-2 px-4 py-2.5 text-white rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                                    style={{
                                                        background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)",
                                                    }}>
                                                    <span>답변 전송</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <p
                                    className={`text-xs text-gray-500 mt-1 ${
                                        message.role === "user" ? "text-right" : "text-left"
                                    }`}>
                                    {formatTo24HourTime(message.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                {isStreaming && streamingContent && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400"></div>
                                <span className="text-sm font-medium">AI 수의사</span>
                            </div>
                            <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-3">
                                <p className="whitespace-pre-wrap">{streamingContent.answer}</p>
                            </div>
                        </div>
                    </div>
                )}
                {isStreaming && !streamingContent && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400"></div>
                                <span className="text-sm font-medium">AI 수의사</span>
                            </div>
                            <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                    <div
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    />
                                    <div
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto flex gap-3">
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
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 resize-none disabled:bg-gray-100"
                        style={{ minHeight: "48px", maxHeight: "120px" }}
                    />
                    {isStreaming ? (
                        <button
                            onClick={handleAbort}
                            className="px-6 py-3 text-white rounded-xl transition-all hover:scale-105"
                            style={{ background: "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)" }}>
                            <StopIcon />
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim() || points <= 0}
                            className="px-6 py-3 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                            style={{
                                background:
                                    inputValue.trim() && points > 0
                                        ? "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)"
                                        : "#d1d5db",
                            }}>
                            <SendIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
