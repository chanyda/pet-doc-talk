import { ButtonHTMLAttributes, ReactNode } from "react";

interface StyledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
}

export function StyledButton({ disabled, children, className = "", style, ...props }: StyledButtonProps) {
    const baseClasses =
        "inline-flex items-center justify-center gap-2 font-medium px-6 py-3 text-base rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg active:scale-100";

    return (
        <button
            disabled={disabled}
            className={`${baseClasses} ${className}`}
            style={{ background: disabled ? "#d1d5db" : "var(--brand-gradient)", color: "#ffffff", ...style }}
            {...props}>
            {children}
        </button>
    );
}
