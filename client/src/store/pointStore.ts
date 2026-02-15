import { create } from "zustand";

import { getMyPoints } from "@/lib/api";

interface PointState {
    points: number;
    setPoints: (points: number) => void;
    fetchPoints: () => Promise<void>;
    decrement: () => void;
}

export const usePointStore = create<PointState>((set) => ({
    points: 0,
    setPoints: (points) => set({ points }),
    fetchPoints: async () => {
        try {
            const response = await getMyPoints();
            set({ points: response.data.amount });
        } catch (error) {
            console.error("Failed to fetch points:", error);
        }
    },
    decrement: () => set((state) => ({ points: Math.max(0, state.points - 1) })),
}));
