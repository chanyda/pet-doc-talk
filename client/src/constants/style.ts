export const POST_CATEGORY_COLOR: { [key: number]: string } = {
    1: "bg-blue-100 text-blue-700",
    2: "bg-purple-100 text-purple-700",
    3: "bg-green-100 text-green-700",
    4: "bg-orange-100 text-orange-700",
};

export const PROFILE_AVATAR_GRADIENTS = [
    "bg-gradient-to-br from-blue-300 via-sky-300 to-cyan-400",
    "bg-gradient-to-br from-purple-300 via-violet-300 to-indigo-400",
    "bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-400",
    "bg-gradient-to-br from-rose-300 via-pink-300 to-purple-400",
    "bg-gradient-to-br from-violet-300 via-purple-300 to-fuchsia-400",
    "bg-gradient-to-br from-indigo-300 via-blue-300 to-sky-400",
    "bg-gradient-to-br from-pink-300 via-rose-300 to-red-400",
    "bg-gradient-to-br from-slate-300 via-blue-300 to-indigo-400",
    "bg-gradient-to-br from-purple-300 via-pink-300 to-rose-400",
    "bg-gradient-to-br from-slate-300 via-gray-300 to-zinc-400",
] as Array<string>;

export const PROFILE_AVATAR_SIZE_CLASS = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
} as const;
