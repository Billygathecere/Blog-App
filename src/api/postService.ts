/**
 * Full-Stack Post Service interfacing with the custom Express + MongoDB backend.
 */

import { Post } from '../types';

export const postService = {
  /**
   * Fetches all articles from the backend API.
   */
  async getAll(): Promise<Post[]> {
    const response = await fetch('/api/posts');
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to download articles from database API.');
    }
    return response.json();
  },

  /**
   * Deletes a stories record permanently via API.
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Could not verify database deletion.');
    }
  },

  /**
   * Submits a newly composed post record to the MongoDB backed database.
   */
  async create(title: string, body: string, authorId: string, authorName: string, imageUrl?: string): Promise<Post> {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        authorId,
        authorName,
        imageUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to publish new story via API.');
    }
    return response.json();
  },

  /**
   * Saves updated fields back into our persistent documents collection.
   */
  async update(id: string, title: string, body: string, authorName: string, imageUrl?: string): Promise<Post> {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        authorName,
        imageUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to submit article alterations.');
    }
    return response.json();
  },

  /**
   * Retrieves live database status to display connectivity in the application interface.
   */
  async getDbStatus(): Promise<{ connected: boolean; mode: string; message: string }> {
    const response = await fetch('/api/db-status').catch(() => null);
    if (!response || !response.ok) {
      return { connected: false, mode: 'Error Connection', message: 'Could not contact Express API.' };
    }
    return response.json();
  }
};
