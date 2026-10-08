import { PostCard } from './PostCard';

export function PostList({
    posts,
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
    if (!posts.length) {
        return <p className="empty-state">No notes yet. Start the conversation.</p>;
    }

    return (
        <div className="post-list">
            {posts.map((post, index) => (
                <PostCard
                    key={post.id}
                    post={post}
                    index={index}
                    user={user}
                    busy={busy}
                    editingPostId={editingPostId}
                    editForm={editForm}
                    setEditForm={setEditForm}
                    onStartEdit={onStartEdit}
                    onSaveEdit={onSaveEdit}
                    onCancelEdit={onCancelEdit}
                    onDeletePost={onDeletePost}
                    onToggleVisibility={onToggleVisibility}
                />
            ))}
        </div>
    );
}
