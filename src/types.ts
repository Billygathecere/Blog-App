/**
 * Shared Type Definitions representing our Blog Platform domain models.
 * We will define User, Post, and AuthState schemas here together.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

