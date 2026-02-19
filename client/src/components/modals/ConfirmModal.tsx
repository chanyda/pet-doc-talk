interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "확인",
    cancelText = "취소",
    variant = "danger",
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: "bg-red-500 hover:bg-red-600",
        warning: "bg-orange-500 hover:bg-orange-600",
        info: "bg-pink-500 hover:bg-pink-600",
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all font-medium cursor-pointer">
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 text-white py-3 rounded-lg transition-all font-medium cursor-pointer ${variantStyles[variant]}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
