<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    public function view(?User $user, Post $post): bool
    {
        return $post->post_status_id === 1 || $user?->id === $post->user_id;
    }

    public function modify(User $user, Post $post): Response
    {
        return $user->id === $post->user_id ? Response::allow() : Response::deny("You do not own this post");
    }
}
