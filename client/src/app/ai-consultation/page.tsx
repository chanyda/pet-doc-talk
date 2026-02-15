import { ConsultationList } from "@/components/ai-consultation/ConsultationList";
import { TopNavigation } from "@/components/layout/TopNavigation";

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-6xl mx-auto px-6 py-8">
                <ConsultationList />
            </main>
        </div>
    );
}
