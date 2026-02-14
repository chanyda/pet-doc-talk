import { notFound } from "next/navigation";

import EditPostPage from "./_components/EditPostPage";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    const postId = Number(id);

    if (isNaN(postId)) {
        notFound();
    }

    return <EditPostPage postId={postId} />;
}
