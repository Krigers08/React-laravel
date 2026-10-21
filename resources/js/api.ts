import axios from 'axios';
import type { AuthPayload, AuthResponse, EditForm, Post, PostForm } from './types';

const api = axios.create({
    baseURL: '/api',
    headers: { Accept: 'application/json' },
});

export function getAuthHeaders(token: string | null) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPosts(authToken = ''): Promise<Post[]> {
    const config = authToken ? { headers: getAuthHeaders(authToken) } : {};
    const response = await api.get<Post[]>('/posts', config);
    return response.data;
}

export async function login(payload: AuthPayload, endpoint = '/login'): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(endpoint, payload);
    return data;
}

export async function register(payload: AuthPayload, endpoint = '/register'): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(endpoint, payload);
    return data;
}

export async function logoutUser(authToken: string | null): Promise<void> {
    await api.post('/logout', {}, { headers: getAuthHeaders(authToken) });
}

export async function createPost(authToken: string | null, payload: PostForm): Promise<Post> {
    const { data } = await api.post<Post>('/posts', payload, {
        headers: getAuthHeaders(authToken),
    });
    return data;
}

export async function updatePost(authToken: string | null, postId: number, payload: EditForm): Promise<Post> {
    const { data } = await api.put<Post>(`/posts/${postId}`, payload, {
        headers: getAuthHeaders(authToken),
    });
    return data;
}

export async function deletePost(authToken: string | null, postId: number): Promise<void> {
    await api.delete(`/posts/${postId}`, {
        headers: getAuthHeaders(authToken),
    });
}

export async function togglePostVisibility(
    authToken: string | null,
    postId: number,
    postStatusId: number,
): Promise<Post> {
    const { data } = await api.patch<Post>(`/posts/${postId}/status`, {
        post_status_id: postStatusId,
    }, {
        headers: getAuthHeaders(authToken),
    });
    return data;
}

export default api;