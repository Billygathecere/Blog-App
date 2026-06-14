import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// We will track the connection state
export let isConnectedToMongo = false;

// We establish an elegant in-memory database fallback to guard against crashes 
// when the user has not yet configured their authentic MongoDB Atlas URI in AI Studio.
interface MockDatabase {
  users: any[];
  posts: any[];
}

const mockDb: MockDatabase = {
  users: [
    {
      id: 'usr_main_demo',
      name: 'Aesthetic Designer',
      email: 'designer@chronicle.com',
      passwordHash: 'demo123',
      createdAt: new Date().toISOString(),
    }
  ],
  posts: [] // Cleared mock data to start with a fresh clean page!
};

// Connect to MongoDB using Mongoose if the URI is set
export async function connectToDatabase() {
  const isValidScheme = MONGODB_URI && (MONGODB_URI.startsWith('mongodb://') || MONGODB_URI.startsWith('mongodb+srv://'));

  if (!isValidScheme) {
    console.warn('⚠️ [DB Warning] MONGODB_URI environment variable is missing, invalid, or has an incorrect scheme.');
    console.log('ℹ️ [DB Info] Server is running with local in-memory database fallback.');
    isConnectedToMongo = false;
    return;
  }

  try {
    // Attempt real connection
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if cluster is offline
    });
    isConnectedToMongo = true;
    console.log('🚀 [DB Success] Connected to MongoDB database successfully.');
  } catch (err: any) {
    console.error(`❌ [DB Error] Failed to connect to MongoDB: ${err.message}`);
    console.log('ℹ️ [DB Info] Falling back to server-side in-memory database.');
    isConnectedToMongo = false;
  }
}

// ==========================================
// MONGODB USER SCHEMA & MODEL
// ==========================================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret: any) => {
      ret.id = ret._id ? ret._id.toString() : '';
      delete ret._id;
      delete ret.__v;
      delete ret.passwordHash; // Protect keys from accidental response leaks
      return ret;
    }
  }
});

export const UserDoc = (mongoose.models.User || mongoose.model('User', userSchema)) as any;

// ==========================================
// MONGODB POST SCHEMA & MODEL
// ==========================================
const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  imageUrl: { type: String },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret: any) => {
      ret.id = ret._id ? ret._id.toString() : '';
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const PostDoc = (mongoose.models.Post || mongoose.model('Post', postSchema)) as any;

// ==========================================
// UNIFIED DATABASE SERVICE (MONGO DB + FALLBACK)
// ==========================================
export const dbService = {
  // --- USER API ADAPTERS ---
  async findUserByEmail(email: string) {
    if (isConnectedToMongo) {
      // Find one user record matching the email (case-insensitive)
      const user = await UserDoc.findOne({ email: email.toLowerCase() });
      if (!user) return null;
      // We need passwordHash for login, so we fetch the raw object
      const rawUser = user.toObject();
      return {
        id: rawUser._id.toString(),
        name: rawUser.name,
        email: rawUser.email,
        passwordHash: user.passwordHash, // Read password directly
        createdAt: rawUser.createdAt.toISOString()
      };
    } else {
      const match = mockDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      return match ? { ...match } : null;
    }
  },

  async createUser(name: string, email: string, passwordHash: string) {
    if (isConnectedToMongo) {
      const newUser = new UserDoc({
        name,
        email: email.toLowerCase(),
        passwordHash,
      });
      const saved = await newUser.save();
      return saved.toJSON();
    } else {
      const newUser = {
        id: `usr_${Math.random().toString(36).substring(2, 11)}`,
        name,
        email: email.toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString()
      };
      mockDb.users.push(newUser);
      // Return a copy without password parameter
      const { passwordHash: _, ...userSafe } = newUser;
      return userSafe;
    }
  },

  // --- POST API ADAPTERS ---
  async getPosts() {
    if (isConnectedToMongo) {
      // Retrieve modern posts sorted from newest to oldest
      const posts = await PostDoc.find().sort({ createdAt: -1 });
      return posts.map(p => p.toJSON());
    } else {
      return [...mockDb.posts];
    }
  },

  async getPostById(id: string) {
    if (isConnectedToMongo) {
      try {
        const post = await PostDoc.findById(id);
        return post ? post.toJSON() : null;
      } catch {
        return null; // Handle malformed MongoDB ObjectIds gracefully
      }
    } else {
      return mockDb.posts.find(p => p.id === id) || null;
    }
  },

  async createPost(title: string, body: string, authorId: string, authorName: string, imageUrl?: string) {
    if (isConnectedToMongo) {
      const post = new PostDoc({
        title,
        body,
        authorId,
        authorName,
        imageUrl,
      });
      const saved = await post.save();
      return saved.toJSON();
    } else {
      const newPost = {
        id: `post_${Math.random().toString(36).substring(2, 11)}`,
        title,
        body,
        authorId,
        authorName,
        imageUrl,
        createdAt: new Date().toISOString()
      };
      mockDb.posts.unshift(newPost);
      return newPost;
    }
  },

  async updatePost(id: string, title: string, body: string, authorName: string, imageUrl?: string) {
    if (isConnectedToMongo) {
      try {
        const post = await PostDoc.findById(id);
        if (!post) throw new Error('Post not found in database.');
        
        post.title = title;
        post.body = body;
        post.authorName = authorName;
        if (imageUrl !== undefined) {
          post.imageUrl = imageUrl;
        }
        
        const saved = await post.save();
        return saved.toJSON();
      } catch (err: any) {
        throw new Error(err.message || 'Failed to update document.');
      }
    } else {
      const idx = mockDb.posts.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Post not found in database.');
      
      const updated = {
        ...mockDb.posts[idx],
        title,
        body,
        authorName,
        imageUrl: imageUrl !== undefined ? imageUrl : mockDb.posts[idx].imageUrl,
        updatedAt: new Date().toISOString()
      };
      mockDb.posts[idx] = updated;
      return updated;
    }
  },

  async deletePost(id: string) {
    if (isConnectedToMongo) {
      try {
        await PostDoc.findByIdAndDelete(id);
      } catch (err: any) {
        throw new Error('Could not perform database deletion.');
      }
    } else {
      mockDb.posts = mockDb.posts.filter(p => p.id !== id);
    }
  },

  // Reset default posts for a truly blank starting canvas when mock posts are wiped
  wipeMockPosts() {
    mockDb.posts = [];
  }
};
