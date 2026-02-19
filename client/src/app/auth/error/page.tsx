import { Suspense } from "react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

import AuthErrorContent from "./_components/AuthErrorContent";

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <AuthErrorContent />
        </Suspense>
    );
}
