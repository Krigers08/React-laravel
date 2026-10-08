export function Header({ user, onLogout, authMode, onToggleAuthMode }) {
    return (
        <header className="topbar">
            <a className="wordmark" href="/" aria-label="Fieldnotes home">
                <span className="brand-mark">F</span>
                <span>fieldnotes</span>
            </a>
            <div className="account-area">
                {user ? (
                    <>
                        <span className="user-label">Signed in as <strong>{user.name}</strong></span>
                        <button className="text-button" onClick={onLogout}>Log out</button>
                    </>
                ) : (
                    <button className="text-button" onClick={onToggleAuthMode}>
                        {authMode === 'login' ? 'Create account' : 'Sign in'}
                    </button>
                )}
            </div>
        </header>
    );
}
