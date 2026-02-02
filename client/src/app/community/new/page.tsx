"use client";

import { CreatePostForm } from "@/components/community/posts/CreatePostForm";
import { CreatePostHeader } from "@/components/community/posts/CreatePostHeader";
import { TopNavigation } from "@/components/layout/TopNavigation";

export default function CreatePostPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <CreatePostHeader />
                    <CreatePostForm />
                </div>
            </main>
        </div>
    );
}
