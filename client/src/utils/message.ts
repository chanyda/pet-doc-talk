/**
 * AI 메시지의 content를 파싱하여 AIMessageContent로 반환
 * - user 메시지는 null 반환
 * - JSON 파싱 실패 시 null 반환 (welcome message 등 plain text)
 * - AIMessageContent 구조가 아니면 null 반환
 */
export function parseAIMessageContent(message: Message): AIMessageContent | null {
    if (message.role !== "assistant") {
        return null;
    }

    try {
        const parsed = JSON.parse(message.content);

        if (typeof parsed !== "object" || parsed === null) {
            return null;
        }

        const answer = typeof parsed.answer === "string" ? parsed.answer : "";
        const checkList = Array.isArray(parsed.checkList) ? parsed.checkList : [];

        // answer도 checkList도 없으면 AI 메시지 형식이 아닌 것으로 간주
        if (!answer && checkList.length === 0) {
            return null;
        }

        return { answer, checkList };
    } catch {
        return null;
    }
}

/**
 * 메시지 표시용 텍스트 반환
 * - user 메시지: content 그대로
 * - AI 메시지 (JSON): answer 필드
 * - AI 메시지 (plain text): content 그대로
 */
export function getMessageDisplayText(message: Message): string | null {
    if (message.role === "user") {
        return message.content;
    }

    const aiContent = parseAIMessageContent(message);
    return aiContent ? aiContent.answer : message.content;
}
