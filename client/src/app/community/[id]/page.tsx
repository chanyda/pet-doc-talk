import { notFound } from "next/navigation";

import PostDetailPage from "./_components/PostDetailPage";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    const postId = Number(id);

    if (isNaN(postId)) {
        notFound();
    }

    return <PostDetailPage postId={postId} />;
}
