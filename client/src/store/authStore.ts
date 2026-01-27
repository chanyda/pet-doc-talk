import { create } from "zustand";

import * as api from "@/lib/api";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
        }),

    setIsLoading: (isLoading) =>
        set({
            isLoading,
        }),

    logout: async () => {
        await api.logout();

        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    },
}));
