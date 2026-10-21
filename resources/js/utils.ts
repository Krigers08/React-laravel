import axios from 'axios';
import type { AuthForm, AuthMode, AuthPayload, EditForm, PostForm } from './types';

export function getAuthEndpoint(authMode: AuthMode): string {
    return authMode === 'login' ? '/login' : '/register';
}

export function createEmptyAuthForm(): AuthForm {
    return { name: '', email: '', password: '' };
}

export function createEmptyPostForm(): PostForm {
    return { title: '', body: '', post_status_id: 1 };
}

export function createEmptyEditForm(): EditForm {
    return { title: '', body: '' };
}

export function buildAuthPayload(authMode: AuthMode, authForm: AuthForm): AuthPayload {
    if (authMode === 'login') {
        return {
            email: authForm.email,
            password: authForm.password,
        };
    }

    return {
        ...authForm,
        password_confirmation: authForm.password,
    };
}

export function togglePostStatus(postStatusId: number): number {
    return postStatusId === 1 ? 2 : 1;
}

export function getVisibilityLabel(postStatusId: number): string {
    return postStatusId === 1 ? 'public' : 'private';
}

export function getToggleVisibilityLabel(postStatusId: number): string {
    return `Make ${getVisibilityLabel(postStatusId) === 'public' ? 'private' : 'public'}`;
}

export function formatPostDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function getApiErrorMessage(exception: unknown): string {
    if (!axios.isAxiosError<{ errors?: Record<string, string[]> }>(exception)) {
        return 'Something went wrong. Please try again.';
    }

    const messages = exception.response?.data?.errors;
    return messages ? Object.values(messages).flat()[0] ?? 'Something went wrong. Please try again.' : 'Something went wrong. Please try again.';
}