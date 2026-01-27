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

        // refresh 요청 자체가 실패한 경우 무한 루프 방지
        const isRefreshRequest =
            originalRequest?.url?.includes("/auth/refresh") ||
            originalRequest?.url === `${API_BASE_URL}/auth/refresh` ||
            originalRequest?.url === "/auth/refresh";

        if (isRefreshRequest) {
            useAuthStore.getState().logout();
            return Promise.reject(error);
        }

        // 401, 403 에러 (인증 실패) 처리
        if (error.response?.status === 401 || error.response?.status === 403) {
            // 이미 재시도한 요청이면 에러 반환
            if (originalRequest?._retry) {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }

            // refresh 시도
            originalRequest._retry = true;

            try {
                await apiClient.post(`${API_BASE_URL}/auth/refresh`);

                // refresh 성공 시 원래 요청 재시도
                return apiClient(originalRequest);
            } catch (refreshError) {
                // refresh 실패 시 로그아웃 처리
                useAuthStore.getState().logout();
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

export async function getUser(): Promise<AxiosResponse<User>> {
    return apiClient.get<User>("/users/me");
}

export async function logout(): Promise<AxiosResponse<void>> {
    return apiClient.post("/auth/logout");
}
