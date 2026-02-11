type MessageRole = "user" | "assistant";

// AI 응답의 체크리스트 항목
interface CheckListItem {
    question: string;
    status: string[]; // ["Yes", "No", "Not sure"]
}

interface AIMessageContent {
    answer: string;
    checkList: CheckListItem[];
}

interface Message {
    id: number;
    consultationId: number;
    role: MessageRole;
    content: string;
    createdAt: string;
}

type SSEEventType = "delta" | "done" | "error";

interface SSEDeltaEvent {
    type: "delta";
    message: {
        role: MessageRole;
        content: string;
    };
}

interface SSEDoneEvent {
    type: "done";
    message: Message;
}

interface SSEErrorEvent {
    type: "error";
    message: string;
}

type SSEEvent = SSEDeltaEvent | SSEDoneEvent | SSEErrorEvent;
