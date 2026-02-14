"use client";

import { PostForm } from "@/components/community/posts/PostForm";
import { PostFormHeader } from "@/components/community/posts/PostFormHeader";
import { TopNavigation } from "@/components/layout/TopNavigation";

export default function NewPostPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <PostFormHeader mode="create" />
                    <PostForm mode="create" />
                </div>
            </main>
        </div>
    );
}
