interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    category: string;
    thumbnail: string | null;
    likes: number;
    comments: number;
    createdAt: string;
}

interface PostItemProps {
    post: Post;
}

const categoryColors: { [key: string]: string } = {
    강아지: "bg-blue-100 text-blue-700",
    고양이: "bg-purple-100 text-purple-700",
    기타동물: "bg-green-100 text-green-700",
    일상: "bg-orange-100 text-orange-700",
    질문: "bg-pink-100 text-pink-700",
};

export function PostItem({ post }: PostItemProps) {
    return (
        <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-pink-200 p-5">
            <div className="flex gap-4">
                {post.thumbnail && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${categoryColors[post.category]}`}>
                            {post.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            <span>🕐</span>
                            {post.createdAt}
                        </span>
                    </div>
                    <h3 className="text-lg mb-2 line-clamp-1 hover:text-pink-600 transition-colors">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{post.content}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{post.author}</span>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <span>❤️</span>
                                <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span>💬</span>
                                <span>{post.comments}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
