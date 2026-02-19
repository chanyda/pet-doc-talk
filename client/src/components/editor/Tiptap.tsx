"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapProps {
    onChange: (html: string) => void;
    initialContent?: string;
}

export function Tiptap({ onChange, initialContent = "" }: TiptapProps) {
    const handleContent = (newContent: string) => {
        onChange(newContent);
    };

    const editor = useEditor({
        // TODO: toolbar 생성 시 extension 추가하기
        content: initialContent,
        extensions: [StarterKit],
        editorProps: {
            attributes: {
                class: "prose max-w-full text-left px-3 md:px-4 py-3 md:py-4 my-4 md:my-6 min-h-[200px] md:min-h-[300px] text-sm md:text-base border border-gray-border rounded-lg focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            handleContent(editor.isEmpty ? "" : editor.getHTML());
        },
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
    });

    return (
        <div>
            <EditorContent editor={editor} />
        </div>
    );
}
