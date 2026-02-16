import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, isAxiosError } from "axios";

import { useAuthStore } from "@/store/authStore";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

// 동시에 여러 API가 401을 받았을 때 refresh를 한 번만 호출하기 위한 변수
let refreshPromise: Promise<AxiosResponse<void>> | null = null;

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

        // 403 에러 (권한 없음) - token refresh로 해결 불가하므로 바로 reject
        if (error.response?.status === 403) {
            return Promise.reject({
                message: (error.response?.data as { message?: string })?.message || "권한이 없습니다.",
                status: 403,
                data: error.response?.data,
            });
        }

        // 401 에러 (인증 만료) - token refresh 후 재시도
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 이미 refresh가 진행 중이면 해당 Promise를 재사용한다.
                if (!refreshPromise) {
                    refreshPromise = tokenRefresh();
                }
                await refreshPromise;

                // refresh 성공 시 원래 요청 재시도
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            } finally {
                refreshPromise = null;
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

export async function getCategories(): Promise<AxiosResponse<Category[]>> {
    return apiClient.get<Category[]>("/categories");
}

export async function getPosts(params: FindPostListQuery): Promise<AxiosResponse<PostListResponse>> {
    return apiClient.get<PostListResponse>("/posts", { params });
}

export async function getPost(postId: number): Promise<AxiosResponse<PostDetail>> {
    return apiClient.get<PostDetail>(`/posts/${postId}`);
}

export async function getComments(
    postId: number,
    params: PaginationQuery,
): Promise<AxiosResponse<CommentListResponse>> {
    return apiClient.get<CommentListResponse>(`/posts/${postId}/comments`, { params });
}

export async function createComment(postId: number, body: CreateCommentBody): Promise<AxiosResponse<Comment>> {
    return apiClient.post<Comment>(`/posts/${postId}/comments`, body);
}

export async function updateComment(commentId: number, body: UpdateCommentBody): Promise<AxiosResponse<Comment>> {
    return apiClient.patch<Comment>(`/comments/${commentId}`, body);
}

export async function deleteComment(commentId: number): Promise<AxiosResponse<void>> {
    return apiClient.delete<void>(`/comments/${commentId}`);
}

export async function getReplies(
    commentId: number,
    params: PaginationQuery,
): Promise<AxiosResponse<ReplyListResponse>> {
    return apiClient.get<ReplyListResponse>(`/comments/${commentId}/replies`, { params });
}

export async function createPost(body: CreatePostBody): Promise<AxiosResponse<PostDetail>> {
    return apiClient.post<PostDetail>("/posts", body);
}

export async function updatePost(postId: number, body: UpdatePostBody): Promise<AxiosResponse<PostDetail>> {
    return apiClient.patch<PostDetail>(`/posts/${postId}`, body);
}

export async function deletePost(postId: number): Promise<AxiosResponse<void>> {
    return apiClient.delete<void>(`/posts/${postId}`);
}

export async function getPets(): Promise<AxiosResponse<Pet[]>> {
    return apiClient.get<Pet[]>("/pets");
}

export async function createPet(body: PetRegistrationFormData): Promise<AxiosResponse<Pet>> {
    return apiClient.post<Pet>("/pets", body);
}

export async function updatePet(petId: number, body: PetRegistrationFormData): Promise<AxiosResponse<Pet>> {
    return apiClient.patch<Pet>(`/pets/${petId}`, body);
}

export async function deletePet(petId: number): Promise<AxiosResponse<void>> {
    return apiClient.delete<void>(`/pets/${petId}`);
}

export async function getMyPosts(params: PaginationQuery): Promise<AxiosResponse<PostListResponse>> {
    return apiClient.get<PostListResponse>("/posts/me", { params });
}

export async function getMyComments(params: PaginationQuery): Promise<AxiosResponse<MyCommentListResponse>> {
    return apiClient.get<MyCommentListResponse>("/comments/me", { params });
}

export async function updateProfile(body: UpdateProfileBody): Promise<AxiosResponse<User>> {
    return apiClient.patch<User>("/users/me", body);
}

export async function getConsultations(params: PaginationQuery): Promise<AxiosResponse<ConsultationListResponse>> {
    return apiClient.get<ConsultationListResponse>("/consultations", { params });
}

export async function createConsultation(body: CreateConsultationBody): Promise<AxiosResponse<Consultation>> {
    return apiClient.post<Consultation>("/consultations", body);
}

export async function deleteConsultation(consultationId: number): Promise<AxiosResponse<void>> {
    return apiClient.delete<void>(`/consultations/${consultationId}`);
}

export async function getMessages(
    consultationId: number,
    params: PaginationQuery,
): Promise<AxiosResponse<MessageListResponse>> {
    return apiClient.get<MessageListResponse>(`/consultations/${consultationId}/messages`, { params });
}

export async function getMyPoints(): Promise<AxiosResponse<PointResponse>> {
    return apiClient.get<PointResponse>("/points/me");
}
