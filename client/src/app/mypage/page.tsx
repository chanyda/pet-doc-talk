import { Suspense } from "react";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

import MypagePage from "./_components/MypagePage";

export default function Page() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <MypagePage />
        </Suspense>
    );
}
