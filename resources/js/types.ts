export type AuthMode = 'login' | 'register';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Post {
    id: number;
    user_id: number;
    title: string;
    body: string;
    post_status_id: number;
    created_at: string;
    updated_at: string;
}

export interface AuthForm {
    name: string;
    email: string;
    password: string;
}

export interface AuthPayload {
    name?: string;
    email: string;
    password: string;
    password_confirmation?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface PostForm {
    title: string;
    body: string;
    post_status_id: number;
}

export interface EditForm {
    title: string;
    body: string;
}