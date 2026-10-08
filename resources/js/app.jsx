import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import {
    createPost,
    deletePost,
    getPosts,
    login,
    logoutUser,
    register,
    togglePostVisibility,
    updatePost,
} from './api';
import { Header } from './components/Header';
import { AuthPanel } from './components/AuthPanel';
import { ComposePanel } from './components/ComposePanel';
import { PostList } from './components/PostList';
import {
    buildAuthPayload,
    createEmptyAuthForm,
    createEmptyEditForm,
    createEmptyPostForm,
    getApiErrorMessage,
    getAuthEndpoint,
    togglePostStatus,
} from './utils';

function App() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [authMode, setAuthMode] = useState('login');
    const [authForm, setAuthForm] = useState(createEmptyAuthForm());
    const [postForm, setPostForm] = useState(createEmptyPostForm());
    const [editingPostId, setEditingPostId] = useState(null);
    const [editForm, setEditForm] = useState(createEmptyEditForm());
    const [error, setError] = useState('');
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [busy, setBusy] = useState(false);

    async function refreshPosts(authToken = token) {
        setLoadingPosts(true);
        try {
            const data = await getPosts(authToken || '');
            setPosts(data);
        } catch {
            setError('Posts could not be loaded. Please try again.');
        } finally {
            setLoadingPosts(false);
        }
    }

    useEffect(() => {
        refreshPosts();
    }, []);

    function handleToggleAuthMode() {
        setAuthMode((currentMode) => (currentMode === 'login' ? 'register' : 'login'));
        setError('');
    }

    function showError(exception) {
        const message = exception?.message === 'Authentication failed'
            ? 'Authentication failed'
            : getApiErrorMessage(exception);

        setError(message);
    }

    async function handleAuth(event) {
        event.preventDefault();
        setBusy(true);
        setError('');

        try {
            const endpoint = getAuthEndpoint(authMode);
            const payload = buildAuthPayload(authMode, authForm);
            const authRequest = authMode === 'login' ? login : register;
            const { token: authToken, user: authUser } = await authRequest(payload, endpoint);

            if (!authToken) {
                throw new Error('Authentication failed');
            }

            setUser(authUser);
            setToken(authToken);
            setAuthForm(createEmptyAuthForm());
            await refreshPosts(authToken);
        } catch (exception) {
            showError(exception);
        } finally {
            setBusy(false);
        }
    }

    async function handleLogout() {
        setError('');

        try {
            await logoutUser(token);
        } catch (exception) {
            showError(exception);
        } finally {
            setUser(null);
            setToken(null);
            setEditingPostId(null);
            await refreshPosts();
        }
    }

    async function handleCreatePost(event) {
        event.preventDefault();
        setBusy(true);
        setError('');

        try {
            await createPost(token, postForm);
            setPostForm(createEmptyPostForm());
            await refreshPosts(token);
        } catch (exception) {
            showError(exception);
        } finally {
            setBusy(false);
        }
    }

    function startEditing(post) {
        setEditingPostId(post.id);
        setEditForm({ title: post.title, body: post.body });
        setError('');
    }

    async function handleUpdatePost(event, postId) {
        event.preventDefault();
        setBusy(true);
        setError('');

        try {
            await updatePost(token, postId, editForm);
            setEditingPostId(null);
            await refreshPosts(token);
        } catch (exception) {
            showError(exception);
        } finally {
            setBusy(false);
        }
    }

    async function handleDeletePost(post) {
        if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
            return;
        }

        setBusy(true);
        setError('');

        try {
            await deletePost(token, post.id);
            await refreshPosts(token);
        } catch (exception) {
            showError(exception);
        } finally {
            setBusy(false);
        }
    }

    async function handleToggleVisibility(post) {
        setBusy(true);
        setError('');

        try {
            const nextStatus = togglePostStatus(post.post_status_id);
            await togglePostVisibility(token, post.id, nextStatus);
            await refreshPosts(token);
        } catch (exception) {
            showError(exception);
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="page-shell">
            <Header
                user={user}
                onLogout={handleLogout}
                authMode={authMode}
                onToggleAuthMode={handleToggleAuthMode}
            />

            <div className="content-grid">
                <section className="feed" aria-labelledby="feed-title">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">The latest</p>
                            <h2 id="feed-title">Community notes</h2>
                        </div>
                        <span className="post-count">{posts.length.toString().padStart(2, '0')} posts</span>
                    </div>
                    {error && <p className="notice" role="alert">{error}</p>}
                    {loadingPosts ? (
                        <p className="empty-state">Gathering the latest notes...</p>
                    ) : (
                        <PostList
                            posts={posts}
                            user={user}
                            busy={busy}
                            editingPostId={editingPostId}
                            editForm={editForm}
                            setEditForm={setEditForm}
                            onStartEdit={startEditing}
                            onSaveEdit={handleUpdatePost}
                            onCancelEdit={() => setEditingPostId(null)}
                            onDeletePost={handleDeletePost}
                            onToggleVisibility={handleToggleVisibility}
                        />
                    )}
                </section>

                <aside className="side-column">
                    {user ? (
                        <ComposePanel
                            postForm={postForm}
                            setPostForm={setPostForm}
                            busy={busy}
                            onSubmit={handleCreatePost}
                        />
                    ) : (
                        <AuthPanel
                            authMode={authMode}
                            authForm={authForm}
                            setAuthForm={setAuthForm}
                            busy={busy}
                            onSubmit={handleAuth}
                            onToggleAuthMode={handleToggleAuthMode}
                        />
                    )}
                    <div className="side-note">
                        <span className="note-stamp">FIELD<br />NOTE 01</span>
                        <p>Good ideas grow when they’re shared.</p>
                    </div>
                </aside>
            </div>
            <footer className="footer"><span>Fieldnotes</span><span></span></footer>
        </main>
    );
}

const root = import.meta.hot?.data.root ?? createRoot(document.getElementById('app'));
if (import.meta.hot) {
    import.meta.hot.data.root = root;
}
root.render(<App />);
