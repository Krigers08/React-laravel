<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_and_show_posts(): void
    {
        $post = Post::factory()->create();
        $privatePost = Post::factory()->create(['post_status_id' => 2]);

        $this->getJson('/api/posts')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonMissing(['id' => $privatePost->id]);
        $this->getJson("/api/posts/{$post->id}")->assertOk()->assertJsonPath('title', $post->title);
    }

    public function test_authenticated_user_can_list_own_private_posts_only(): void
    {
        $owner = User::factory()->create();
        $privatePost = Post::factory()->create(['user_id' => $owner->id, 'post_status_id' => 2]);
        $otherPrivatePost = Post::factory()->create(['post_status_id' => 2]);

        $this->withTokenFor($owner)
            ->getJson('/api/posts')
            ->assertOk()
            ->assertJsonFragment(['id' => $privatePost->id])
            ->assertJsonMissing(['id' => $otherPrivatePost->id]);
    }

    public function test_only_owner_can_show_private_post(): void
    {
        $post = Post::factory()->create(['post_status_id' => 2]);

        $this->getJson("/api/posts/{$post->id}")->assertForbidden();

        $this->withTokenFor($post->user)
            ->getJson("/api/posts/{$post->id}")
            ->assertOk()
            ->assertJsonPath('id', $post->id);
    }

    public function test_guest_cannot_create_post(): void
    {
        $this->postJson('/api/posts', ['title' => 'Hi', 'body' => 'Text'])->assertUnauthorized();
    }

    public function test_user_can_create_post(): void
    {
        $user = User::factory()->create();

        $this->withTokenFor($user)
            ->postJson('/api/posts', ['title' => 'Hi', 'body' => 'Text'])
            ->assertCreated()
            ->assertJsonPath('user_id', $user->id);

        $this->assertDatabaseHas('posts', ['title' => 'Hi', 'user_id' => $user->id]);
    }

    public function test_user_can_create_private_post(): void
    {
        $user = User::factory()->create();

        $this->withTokenFor($user)
            ->postJson('/api/posts', ['title' => 'Private', 'body' => 'Text', 'post_status_id' => 2])
            ->assertCreated()
            ->assertJsonPath('post_status_id', 2);
    }

    public function test_create_post_validates_input(): void
    {
        $this->withTokenFor(User::factory()->create())
            ->postJson('/api/posts', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'body']);
    }

    public function test_owner_can_update_post(): void
    {
        $post = Post::factory()->create();

        $this->withTokenFor($post->user)
            ->putJson("/api/posts/{$post->id}", ['title' => 'New', 'body' => 'New body'])
            ->assertOk()
            ->assertJsonPath('title', 'New');
    }

    public function test_other_user_cannot_update_post(): void
    {
        $post = Post::factory()->create();

        $this->withTokenFor(User::factory()->create())
            ->putJson("/api/posts/{$post->id}", ['title' => 'New', 'body' => 'New body'])
            ->assertForbidden();
    }

    public function test_owner_can_delete_post(): void
    {
        $post = Post::factory()->create();

        $this->withTokenFor($post->user)->deleteJson("/api/posts/{$post->id}")->assertOk();

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    public function test_other_user_cannot_delete_post(): void
    {
        $post = Post::factory()->create();

        $this->withTokenFor(User::factory()->create())->deleteJson("/api/posts/{$post->id}")->assertForbidden();

        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }

    public function test_owner_can_change_status(): void
    {
        $post = Post::factory()->create();

        $this->withTokenFor($post->user)
            ->patchJson("/api/posts/{$post->id}/status", ['post_status_id' => 2])
            ->assertOk()
            ->assertJsonPath('status.name', 'private');
    }

    public function test_status_must_exist(): void
    {
        $post = Post::factory()->create();

        $this->withTokenFor($post->user)
            ->patchJson("/api/posts/{$post->id}/status", ['post_status_id' => 999])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['post_status_id']);
    }

    public function test_other_user_cannot_change_status(): void
    {
        $post = Post::factory()->create();

        $this->withTokenFor(User::factory()->create())
            ->patchJson("/api/posts/{$post->id}/status", ['post_status_id' => 2])
            ->assertForbidden();
    }
}
