/**
 * Skeleton service interfacing with state and post records.
 * We will implement getAll, getById, create, update, and delete methods here together.
 */

import { Post } from '../types';

// Let's create some initial starter posts to populate the timeline.
const DEFAULT_POSTS: Post[] = [
  {
    id: 'post_1',
    title: 'Visual Storytelling in Minimalist Design',
    body: 'Good design comes from intentional pairings, not defaults. Selecting clean typography layouts and preserving generous margins helps direct user visual attention seamlessly without excessive visual clutter. Focus on creating rhythm through variation in padding, scale, and high-contrast styling choices.',
    authorId: 'usr_main_demo',
    authorName: 'Aesthetic Designer',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    imageUrl: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'post_2',
    title: 'The Blueprint of Architectural Layouts',
    body: 'Developing responsive UI applications demands desktop-first design precision backed by mobile-first code workflows. Ensure comfortable touch targets (minimum 44px on mobile) and adaptive, beautifully balanced container boxes for premium rendering outputs.',
    authorId: 'usr_other',
    authorName: 'Ada Lovelace',
    createdAt: new Date().toISOString(), // Just created
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
  }
];

export const postService = {
  /**
   * Fetches all stories from our localStorage database.
   */
  async getAll(): Promise<Post[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem('chronicle_posts');
        if (!stored) {
          localStorage.setItem('chronicle_posts', JSON.stringify(DEFAULT_POSTS));
          resolve(DEFAULT_POSTS);
        } else {
          resolve(JSON.parse(stored));
        }
      }, 400); // 400ms lag simulator
    });
  },

  /**
   * Deletes a story by filtering it out of our database.
   */
  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const stored = localStorage.getItem('chronicle_posts');
        const posts: Post[] = stored ? JSON.parse(stored) : DEFAULT_POSTS;
        const filtered = posts.filter((p) => p.id !== id);
        
        localStorage.setItem('chronicle_posts', JSON.stringify(filtered));
        resolve();
      }, 300);
    });
  },

  /**
   * Mock creation method to insert list items.
   */
  async create(title: string, body: string, authorId: string, authorName: string, imageUrl?: string): Promise<Post> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPost: Post = {
          id: `post_${Math.random().toString(36).substr(2, 9)}`,
          title,
          body,
          authorId,
          authorName,
          createdAt: new Date().toISOString(),
          imageUrl,
        };
        const stored = localStorage.getItem('chronicle_posts');
        const posts: Post[] = stored ? JSON.parse(stored) : [];
        posts.unshift(newPost);
        localStorage.setItem('chronicle_posts', JSON.stringify(posts));
        resolve(newPost);
      }, 300);
    });
  },

  /**
   * Updates an existing story in localStorage database.
   */
  async update(id: string, title: string, body: string, authorName: string, imageUrl?: string): Promise<Post> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const stored = localStorage.getItem('chronicle_posts');
        const posts: Post[] = stored ? JSON.parse(stored) : DEFAULT_POSTS;
        const index = posts.findIndex((p) => p.id === id);
        if (index === -1) {
          reject(new Error('Post not found in database.'));
          return;
        }
        const updatedPost: Post = {
          ...posts[index],
          title,
          body,
          authorName,
          imageUrl,
          updatedAt: new Date().toISOString(),
        };
        posts[index] = updatedPost;
        localStorage.setItem('chronicle_posts', JSON.stringify(posts));
        resolve(updatedPost);
      }, 300);
    });
  }
};
