import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { Accept: 'application/json' },
});

export function getAuthHeaders(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPosts(authToken = '') {
    const config = authToken ? { headers: getAuthHeaders(authToken) } : {};
    const response = await api.get('/posts', config);
    return response.data;
}

export async function login(payload) {
    const { data } = await api.post('/login', payload);
    return data;
}

export async function register(payload) {
    const { data } = await api.post('/register', payload);
    return data;
}

export async function logoutUser(authToken) {
    await api.post('/logout', {}, { headers: getAuthHeaders(authToken) });
}

export async function createPost(authToken, payload) {
    const { data } = await api.post('/posts', payload, {
        headers: getAuthHeaders(authToken),
    });
    return data;
}

export async function updatePost(authToken, postId, payload) {
    const { data } = await api.put(`/posts/${postId}`, payload, {
        headers: getAuthHeaders(authToken),
    });
    return data;
}

export async function deletePost(authToken, postId) {
    await api.delete(`/posts/${postId}`, {
        headers: getAuthHeaders(authToken),
    });
}

export async function togglePostVisibility(authToken, postId, postStatusId) {
    const { data } = await api.patch(`/posts/${postId}/status`, {
        post_status_id: postStatusId,
    }, {
        headers: getAuthHeaders(authToken),
    });
    return data;
}

export default api;
