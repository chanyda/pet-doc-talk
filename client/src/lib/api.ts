import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, isAxiosError } from "axios";

import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    console.log(config.url);
    return config;
});

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: unknown) => {
        if (!isAxiosError(error)) {
            return Promise.reject(error);
        }

        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 네트워크 에러 처리
        if (error.code === "ERR_NETWORK") {
            console.error("Network Issue", "Communication with server failed");
            return Promise.reject(error);
        }

        // refresh API에서 오류가 발생한 경우, 로그아웃 처리한다.
        if (originalRequest?.url?.includes("/auth/refresh")) {
            await logout();
            return Promise.reject(error);
        }

        // 401, 403 에러 (인증 실패) 처리
        if (error.response?.status === 401 || error.response?.status === 403) {
            try {
                await tokenRefresh();

                // refresh 성공 시 원래 요청 재시도
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        // 400, 500 에러 처리
        if (error.response?.status === 400 || error.response?.status === 500) {
            const message = error.response?.data?.message;
            if (message) {
                console.error(message);
                return Promise.reject(new Error(message));
            }
        }

        const errorMessage =
            (error.response?.data as { message?: string })?.message ||
            error.message ||
            "알 수 없는 오류가 발생했습니다.";

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status || 500,
            data: error.response?.data,
        });
    },
);

export async function logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    useAuthStore.getState().logout();
}

export async function getUser(): Promise<AxiosResponse<User>> {
    return apiClient.get<User>("/users/me");
}

export async function tokenRefresh(): Promise<AxiosResponse<void>> {
    return apiClient.post("/auth/refresh");
}
