import { formatPostDate, getToggleVisibilityLabel, getVisibilityLabel } from '../utils';

export function PostCard({
    post,
    index,
    user,
    busy,
    editingPostId,
    editForm,
    setEditForm,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDeletePost,
    onToggleVisibility,
}) {
    const isOwner = user?.id === post.user_id;
    const visibilityLabel = getVisibilityLabel(post.post_status_id);
    const toggleLabel = getToggleVisibilityLabel(post.post_status_id);

    return (
        <article className="post-item" key={post.id}>
            <div className="post-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="post-content">
                {editingPostId === post.id ? (
                    <form className="edit-form" onSubmit={(event) => onSaveEdit(event, post.id)}>
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
                            <button className="text-button" disabled={busy} type="button" onClick={onCancelEdit}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="post-title-row">
                            <h3>{post.title}</h3>
                            {isOwner && post.post_status_id === 2 && <span className="visibility-badge">{visibilityLabel}</span>}
                        </div>
                        <p>{post.body}</p>
                        <div className="post-meta">
                            <time>{formatPostDate(post.created_at)}</time>
                            {isOwner && <span>Your note</span>}
                        </div>
                        {isOwner && (
                            <div className="post-actions" aria-label={`Actions for ${post.title}`}>
                                <button className="text-button" disabled={busy} type="button" onClick={() => onStartEdit(post)}>Edit</button>
                                <button className="text-button" disabled={busy} type="button" onClick={() => onToggleVisibility(post)}>
                                    {toggleLabel}
                                </button>
                                <button className="text-button danger-button" disabled={busy} type="button" onClick={() => onDeletePost(post)}>Delete</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </article>
    );
}
