import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import Route modules
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

// Import Custom Middlewares
import { errorHandler } from './middleware/error.js';
import socketHandler from './socket/socketHandler.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// 1. Initialize Socket.io Server with proper CORS setups
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// 2. Production Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Morgan development console logging
app.use(morgan('dev'));

// Payload Parsing limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. API Rate Limiting protection
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 200, // limit each IP to 200 requests per window
  message: {
    success: false,
    message: 'Too many requests registered from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(globalLimiter);

// 4. API Core Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/quiz', quizRoutes);

// Base sanity check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SMART_X Futuristic AI SaaS Platform Core API Server Online.',
    status: 'Operational',
    version: '1.0.0'
  });
});

// 5. Global Error Handling Middleware mount
app.use(errorHandler);

// 6. Bind Socket.io Event logic
socketHandler(io);

// 7. Boot HTTP Server listening on PORT (skip when running on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`
    ======================================================
    🚀 SMART_X Advanced Express Backend Server Online!
    🌍 Port: http://localhost:${PORT}/
    🛡️ Security Layers: Active (Helmet, CORS, Rate limits)
    🔌 Socket.io Channels: Operational
    ======================================================
    `);
  });
}

export { app, server };
export default app;
