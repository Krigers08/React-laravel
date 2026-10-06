import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './app.css';

const api = axios.create({
    baseURL: '/api',
    headers: { Accept: 'application/json' },
});

function App() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [authMode, setAuthMode] = useState('login');
    const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
    const [postForm, setPostForm] = useState({ title: '', body: '', post_status_id: 1 });
    const [editingPostId, setEditingPostId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', body: '' });
    const [error, setError] = useState('');
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [busy, setBusy] = useState(false);

    async function loadPosts(authToken = token) {
        setLoadingPosts(true);
        try {
            const config = authToken
                ? { headers: { Authorization: `Bearer ${authToken}` } }
                : {};
            const response = await api.get('/posts', config);
            setPosts(response.data);
        } catch {
            setError('Posts could not be loaded. Please try again.');
        } finally {
            setLoadingPosts(false);
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    function showError(exception) {
        const messages = exception.response?.data?.errors;
        setError(messages ? Object.values(messages).flat()[0] : 'Something went wrong. Please try again.');
    }

    async function handleAuth(event) {
        event.preventDefault();
        setBusy(true);
        setError('');
        try {
            const endpoint = authMode === 'login' ? '/login' : '/register';
            const payload = authMode === 'login'
                ? { email: authForm.email, password: authForm.password }
                : { ...authForm, password_confirmation: authForm.password };
            const { data } = await api.post(endpoint, payload);
            if (!data.token) {
                throw new Error('Authentication failed');
            }
            setUser(data.user);
            setToken(data.token);
            setAuthForm({ name: '', email: '', password: '' });
            await loadPosts(data.token);
        } catch (exception) {
            showError(exception);
        } finally {
            setBusy(false);
        }
    }

    async function handleLogout() {
        setError('');
        try {
            await api.post('/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
        } catch (exception) {
            showError(exception);
        } finally {
            setUser(null);
            setToken(null);
            setEditingPostId(null);
            await loadPosts(null);
        }
    }

    async function handleCreatePost(event) {
        event.preventDefault();
        setBusy(true);
        setError('');
        try {
            await api.post('/posts', postForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPostForm({ title: '', body: '', post_status_id: 1 });
            await loadPosts();
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
            await api.put(`/posts/${postId}`, editForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditingPostId(null);
            await loadPosts();
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
            await api.delete(`/posts/${post.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await loadPosts();
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
            await api.patch(`/posts/${post.id}/status`, {
                post_status_id: post.post_status_id === 1 ? 2 : 1,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await loadPosts();
        } catch (exception) {
            showError(exception);
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="page-shell">
            <header className="topbar">
                <a className="wordmark" href="/" aria-label="Fieldnotes home">
                    <span className="brand-mark">F</span>
                    <span>fieldnotes</span>
                </a>
                <div className="account-area">
                    {user ? (
                        <>
                            <span className="user-label">Signed in as <strong>{user.name}</strong></span>
                            <button className="text-button" onClick={handleLogout}>Log out</button>
                        </>
                    ) : (
                        <button className="text-button" onClick={() => {
                            setAuthMode(authMode === 'login' ? 'register' : 'login');
                            setError('');
                        }}>
                            {authMode === 'login' ? 'Create account' : 'Sign in'}
                        </button>
                    )}
                </div>
            </header>

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
                    ) : posts.length ? (
                        <div className="post-list">
                            {posts.map((post, index) => {
                                const isOwner = user?.id === post.user_id;

                                return (
                                    <article className="post-item" key={post.id}>
                                        <div className="post-index">{String(index + 1).padStart(2, '0')}</div>
                                        <div className="post-content">
                                            {editingPostId === post.id ? (
                                                <form className="edit-form" onSubmit={(event) => handleUpdatePost(event, post.id)}>
                                                    <label>
                                                        Title
                                                        <input
                                                            required
                                                            maxLength="255"
                                                            value={editForm.title}
                                                            onChange={(event) => setEditForm({ ...editForm, title: event.target.value })}
                                                        />
                                                    </label>
                                                    <label>
                                                        Your note
                                                        <textarea
                                                            required
                                                            rows="5"
                                                            value={editForm.body}
                                                            onChange={(event) => setEditForm({ ...editForm, body: event.target.value })}
                                                        />
                                                    </label>
                                                    <div className="post-actions">
                                                        <button className="primary-button" disabled={busy} type="submit">Save changes</button>
                                                        <button className="text-button" disabled={busy} type="button" onClick={() => setEditingPostId(null)}>Cancel</button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <div className="post-title-row">
                                                        <h3>{post.title}</h3>
                                                        {isOwner && post.post_status_id === 2 && <span className="visibility-badge">Private</span>}
                                                    </div>
                                                    <p>{post.body}</p>
                                                    <div className="post-meta">
                                                        <time>{new Date(post.created_at).toLocaleDateString(undefined, {
                                                            year: 'numeric', month: 'long', day: 'numeric',
                                                        })}</time>
                                                        {isOwner && <span>Your note</span>}
                                                    </div>
                                                    {isOwner && (
                                                        <div className="post-actions" aria-label={`Actions for ${post.title}`}>
                                                            <button className="text-button" disabled={busy} type="button" onClick={() => startEditing(post)}>Edit</button>
                                                            <button className="text-button" disabled={busy} type="button" onClick={() => handleToggleVisibility(post)}>
                                                                Make {post.post_status_id === 1 ? 'private' : 'public'}
                                                            </button>
                                                            <button className="text-button danger-button" disabled={busy} type="button" onClick={() => handleDeletePost(post)}>Delete</button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="empty-state">No notes yet. Start the conversation.</p>
                    )}
                </section>

                <aside className="side-column">
                    {user ? (
                        <section className="compose-panel">
                            <p className="eyebrow">Your notebook</p>
                            <h2>Share a note</h2>
                            <form onSubmit={handleCreatePost} className="form-stack">
                                <label>
                                    Title
                                    <input
                                        required
                                        maxLength="255"
                                        value={postForm.title}
                                        onChange={(event) => setPostForm({ ...postForm, title: event.target.value })}
                                        placeholder="A thought to keep"
                                    />
                                </label>
                                <label>
                                    Your note
                                    <textarea
                                        required
                                        rows="5"
                                        value={postForm.body}
                                        onChange={(event) => setPostForm({ ...postForm, body: event.target.value })}
                                        placeholder="Write something worth sharing..."
                                    />
                                </label>
                                <label>
                                    Visibility
                                    <select
                                        value={postForm.post_status_id}
                                        onChange={(event) => setPostForm({ ...postForm, post_status_id: Number(event.target.value) })}
                                    >
                                        <option value={1}>Public</option>
                                        <option value={2}>Private</option>
                                    </select>
                                </label>
                                <button className="primary-button" disabled={busy} type="submit">
                                    {busy ? 'Publishing...' : 'Publish note'}
                                </button>
                            </form>
                        </section>
                    ) : (
                        <section className="auth-panel">
                            <p className="eyebrow">Join the conversation</p>
                            <h2>{authMode === 'login' ? 'Welcome back.' : 'Make yourself at home.'}</h2>
                            <p className="panel-copy">
                                {authMode === 'login'
                                    ? 'Sign in to publish a note and keep your ideas in one place.'
                                    : 'Create an account to share notes with the community.'}
                            </p>
                            <form onSubmit={handleAuth} className="form-stack">
                                {authMode === 'register' && (
                                    <label>
                                        Name
                                        <input
                                            required
                                            autoComplete="name"
                                            value={authForm.name}
                                            onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                                            placeholder="Your name"
                                        />
                                    </label>
                                )}
                                <label>
                                    Email
                                    <input
                                        required
                                        type="email"
                                        autoComplete="email"
                                        value={authForm.email}
                                        onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                                        placeholder="you@example.com"
                                    />
                                </label>
                                <label>
                                    Password
                                    <input
                                        required
                                        type="password"
                                        autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                                        value={authForm.password}
                                        onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                                        placeholder="At least 8 characters"
                                    />
                                </label>
                                <button className="primary-button" disabled={busy} type="submit">
                                    {busy ? 'Please wait...' : authMode === 'login' ? 'Sign in' : 'Create account'}
                                    <span aria-hidden="true">↗</span>
                                </button>
                            </form>
                            <button className="mode-button" onClick={() => {
                                setAuthMode(authMode === 'login' ? 'register' : 'login');
                                setError('');
                            }}>
                                {authMode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
                            </button>
                        </section>
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
