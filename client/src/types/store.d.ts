interface AuthStateData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthState extends AuthStateData {
    setUser: (user: User | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    logout: () => void;
}
