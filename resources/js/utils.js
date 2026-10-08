export function getAuthEndpoint(authMode) {
    return authMode === 'login' ? '/login' : '/register';
}

export function createEmptyAuthForm() {
    return { name: '', email: '', password: '' };
}

export function createEmptyPostForm() {
    return { title: '', body: '', post_status_id: 1 };
}

export function createEmptyEditForm() {
    return { title: '', body: '' };
}

export function buildAuthPayload(authMode, authForm) {
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

export function togglePostStatus(postStatusId) {
    return postStatusId === 1 ? 2 : 1;
}

export function getVisibilityLabel(postStatusId) {
    return postStatusId === 1 ? 'public' : 'private';
}

export function getToggleVisibilityLabel(postStatusId) {
    return `Make ${getVisibilityLabel(postStatusId) === 'public' ? 'private' : 'public'}`;
}

export function formatPostDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function getApiErrorMessage(exception) {
    const messages = exception.response?.data?.errors;

    if (messages) {
        return Object.values(messages).flat()[0];
    }

    return 'Something went wrong. Please try again.';
}
