export function ComposePanel({
    postForm,
    setPostForm,
    busy,
    onSubmit,
}) {
    return (
        <section className="compose-panel">
            <p className="eyebrow">Your notebook</p>
            <h2>Share a note</h2>
            <form onSubmit={onSubmit} className="form-stack">
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
    );
}
