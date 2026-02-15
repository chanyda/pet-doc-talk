import SparklesIcon from "public/icons/sparkles-icon.svg";

export function AIAvatar() {
    return (
        <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400">
                <SparklesIcon stroke="#ffffff" />
            </div>
            <span className="text-sm font-medium">AI 수의사</span>
        </div>
    );
}
