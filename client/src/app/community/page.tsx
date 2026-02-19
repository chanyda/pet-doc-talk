import { Suspense } from "react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

import CommunityPage from "./_components/CommunityPage";

export default function Page() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <CommunityPage />
        </Suspense>
    );
}
