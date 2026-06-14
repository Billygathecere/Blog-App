import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectToDatabase, dbService, isConnectedToMongo } from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // ==========================================
  // 📚 HOW ROUTING AND EXPRESS API WORK
  // ==========================================
  //
  // 1. WHAT IS MIDDLEWARE?
  //    Middlewares are functions executed sequentially before request parameters hit 
  //    your final endpoint handlers. Inside express, "app.use()" registers them.
  //    Here, "express.json()" is a parser middleware. Since HTTP requests transmit 
  //    raw streams of bytes, this parser detects "Content-Type: application/json" 
  //    and automatically parses that byte stream into a structured javascript object 
  //    mounted directly onto the "req.body" convenience attribute!
  app.use(express.json());

  // 2. CONNECT TO THE DATABASE
  //    Triggers our connection function inside /server/db.ts. This will connect to 
  //    your MongoDB cluster if MONGODB_URI is declared in your workspace secrets.
  await connectToDatabase();

  // 3. UNDERSTANDING THE ANATOMY OF AN ENDPOINT:
  //    An endpoint is mapped via: app.<HTTP_METHOD>(path, handlerCallback)
  //    - HTTP_METHOD: describes the type of operation (GET=Read, POST=Create, PUT=Update, DELETE=Remove).
  //    - path: the relative url matching criteria (e.g., "/api/posts").
  //    - handlerCallback: (req, res) => {} which acts as the execution controller:
  //         - req (Request object): Contains incoming parameter payloads (req.body, req.params, query parameters).
  //         - res (Response object): Interface used to respond back to the browser client (e.g. res.json(), res.status()).

  // ==========================================
  // 🛰️ API ROUTING ENDPOINTS
  // ==========================================

  /**
   * GET /api/db-status
   * Provides real-time feedback on whether the app has established a direct 
   * live connection to your MongoDB instance, or is running on fallback modes.
   */
  app.get('/api/db-status', (req, res) => {
    res.json({
      connected: isConnectedToMongo,
      mode: isConnectedToMongo ? 'MongoDB Atlas' : 'In-Memory Fallback DB',
      message: isConnectedToMongo 
        ? 'Successfully connected to MongoDB cluster.'
        : 'Running on local server fallback. Inputting fresh posts works, but will reset on server boot.'
    });
  });

  /**
   * GET /api/posts
   * Routing purpose: Queries and returns all creative articles from our collections.
   */
  app.get('/api/posts', async (req, res) => {
    try {
      const posts = await dbService.getPosts();
      // res.json() serialization sends a 200 OK status code along with the serialized post array
      res.json(posts);
    } catch (err: any) {
      console.error('Error fetching posts:', err.message);
      res.status(500).json({ error: 'Failed to retrieve articles from database' });
    }
  });

  /**
   * POST /api/posts
   * Routing purpose: Creates and inserts a brand new article.
   * Parameter: req.body holds input fields (title, body, authorId, authorName, imageUrl) sent by the frontend editor form.
   */
  app.post('/api/posts', async (req, res) => {
    try {
      const { title, body, authorId, authorName, imageUrl } = req.body;
      
      // Basic server side validation to reject empty parameters
      if (!title?.trim() || !body?.trim() || !authorName?.trim()) {
        return res.status(400).json({ error: 'Title, Body, and Author Name are required parameter fields.' });
      }

      const newPost = await dbService.createPost(title, body, authorId, authorName, imageUrl);
      
      // 201 Created reflects successful resource initialization 
      res.status(201).json(newPost);
    } catch (err: any) {
      console.error('Error creating post:', err.message);
      res.status(500).json({ error: 'Failed to insert article into database.' });
    }
  });

  /**
   * PUT /api/posts/:id
   * Routing purpose: Updates an existing article document.
   * Parameter: "req.params.id" extracts the string ID from the request URL route match.
   */
  app.put('/api/posts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, body, authorName, imageUrl } = req.body;

      if (!title?.trim() || !body?.trim() || !authorName?.trim()) {
        return res.status(400).json({ error: 'Revised Title, Body, and Author Name are required parameter fields.' });
      }

      const updatedPost = await dbService.updatePost(id, title, body, authorName, imageUrl);
      res.json(updatedPost);
    } catch (err: any) {
      console.error('Error updating post:', err.message);
      res.status(500).json({ error: err.message || 'Failed to update article in database.' });
    }
  });

  /**
   * DELETE /api/posts/:id
   * Routing purpose: Permanently deletes an article matching the specified ID parameter.
   */
  app.delete('/api/posts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await dbService.deletePost(id);
      res.json({ success: true, message: 'Article deleted successfully.' });
    } catch (err: any) {
      console.error('Error deleting post:', err.message);
      res.status(500).json({ error: 'Failed to filter and remove article from database.' });
    }
  });

  /**
   * POST /api/auth/register
   * Routing purpose: Safely registers a brand new account record.
   */
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name?.trim() || !email?.trim() || !password?.trim()) {
        return res.status(400).json({ error: 'Registration parameters name, email, and password cannot be empty.' });
      }

      // Check if user email has already been taken
      const existingUser = await dbService.findUserByEmail(email);
      if (existingUser) {
        return res.status(499).json({ error: 'This email account is already registered in our database.' });
      }

      const newUser = await dbService.createUser(name, email, password);
      res.status(201).json(newUser);
    } catch (err: any) {
      console.error('Error during registration:', err.message);
      res.status(500).json({ error: 'Auth system failed to register user profile.' });
    }
  });

  /**
   * POST /api/auth/login
   * Routing purpose: Validates credentials and mounts an active session profile.
   */
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({ error: 'Please enter both Email and Passcode.' });
      }

      const user = await dbService.findUserByEmail(email);
      if (!user || user.passwordHash !== password) {
        return res.status(401).json({ error: 'Invalid email credentials or incorrect passcode.' });
      }

      // We respond with a safe profile dictionary, avoiding exposing secret password parameters
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      });
    } catch (err: any) {
      console.error('Error during login:', err.message);
      res.status(500).json({ error: 'Server authentication system encountered an error.' });
    }
  });


  // ==========================================
  // 🏢 VITE MIDDLEWARE & FRONTEND INTEGRATION
  // ==========================================
  //
  // Here, we integrate the Express API with Vite's client bundler.
  // - In Development Mode (process.env.NODE_ENV !== 'production'):
  //   We hook up Vite's dev server as an Express middleware. In contrast to separate processes,
  //   this hosts our database API and SPA code seamlessly on port 3000!
  // - In Production Mode:
  //   Our code compiles down to the "dist" output. We serve the compiled files statically, 
  //   routing standard browser entry point navigations directly to the index.html.

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind server exclusively to port 3000 (Required for Cloud Run and nginx ingress)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`🌐 [CHRONICLE BACKEND] Server online!`);
    console.log(`   Host: http://localhost:${PORT}`);
    console.log(`   Env:  ${process.env.NODE_ENV || 'development'}`);
    console.log(`===============================================`);
  });
}

startServer();
