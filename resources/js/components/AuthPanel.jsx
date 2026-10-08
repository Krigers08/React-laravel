export function AuthPanel({
    authMode,
    authForm,
    setAuthForm,
    busy,
    onSubmit,
    onToggleAuthMode,
}) {
    return (
        <section className="auth-panel">
            <p className="eyebrow">Join the conversation</p>
            <h2>{authMode === 'login' ? 'Welcome back.' : 'Make yourself at home.'}</h2>
            <p className="panel-copy">
                {authMode === 'login'
                    ? 'Sign in to publish a note and keep your ideas in one place.'
                    : 'Create an account to share notes with the community.'}
            </p>
            <form onSubmit={onSubmit} className="form-stack">
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
            <button className="mode-button" onClick={onToggleAuthMode}>
                {authMode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
            </button>
        </section>
    );
}
