import { describe, expect, it } from 'vitest';
import {
    buildAuthPayload,
    createEmptyAuthForm,
    createEmptyEditForm,
    createEmptyPostForm,
    getAuthEndpoint,
    getToggleVisibilityLabel,
    getVisibilityLabel,
    togglePostStatus,
} from './utils';

describe('form helpers', () => {
    it('creates empty forms with the default public status', () => {
        expect(createEmptyAuthForm()).toEqual({ name: '', email: '', password: '' });
        expect(createEmptyEditForm()).toEqual({ title: '', body: '' });
        expect(createEmptyPostForm()).toEqual({ title: '', body: '', post_status_id: 1 });
    });

    it('builds the correct login and registration payloads', () => {
        const form = { name: 'Ada', email: 'ada@example.com', password: 'secret' };

        expect(buildAuthPayload('login', form)).toEqual({
            email: 'ada@example.com',
            password: 'secret',
        });
        expect(buildAuthPayload('register', form)).toEqual({
            ...form,
            password_confirmation: 'secret',
        });
    });

    it('selects the matching authentication endpoint', () => {
        expect(getAuthEndpoint('login')).toBe('/login');
        expect(getAuthEndpoint('register')).toBe('/register');
    });
});

describe('post visibility helpers', () => {
    it('toggles between public and private status IDs', () => {
        expect(togglePostStatus(1)).toBe(2);
        expect(togglePostStatus(2)).toBe(1);
    });

    it('returns visibility and next-action labels', () => {
        expect(getVisibilityLabel(1)).toBe('public');
        expect(getVisibilityLabel(2)).toBe('private');
        expect(getToggleVisibilityLabel(1)).toBe('Make private');
        expect(getToggleVisibilityLabel(2)).toBe('Make public');
    });
});