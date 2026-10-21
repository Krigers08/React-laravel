import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { PostCard } from './PostCard';
import type { EditForm, Post, User } from '../types';

interface PostListProps {
    posts: Post[];
    user: User | null;
    busy: boolean;
    editingPostId: number | null;
    editForm: EditForm;
    setEditForm: Dispatch<SetStateAction<EditForm>>;
    onStartEdit: (post: Post) => void;
    onSaveEdit: (event: FormEvent<HTMLFormElement>, postId: number) => void;
    onCancelEdit: () => void;
    onDeletePost: (post: Post) => void;
    onToggleVisibility: (post: Post) => void;
}

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
}: PostListProps) {
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