"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Main entry point for the backend API
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Import configuration
const env_1 = __importDefault(require("./config/env"));
const cors_2 = require("./config/cors");
// Import middleware
const error_middleware_1 = require("./middleware/error.middleware");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const students_routes_1 = __importDefault(require("./routes/students.routes"));
const sessions_routes_1 = __importDefault(require("./routes/sessions.routes"));
const wordpress_routes_1 = __importDefault(require("./routes/wordpress.routes"));
// Initialize Express app
const app = (0, express_1.default)();
const PORT = env_1.default.port;
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)(cors_2.corsConfig));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: env_1.default.rateLimit, // Limit each IP to 100 requests per minute
    message: {
        error: 'Too many requests from this IP, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env_1.default.nodeEnv,
    });
});
// API routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/students', students_routes_1.default);
app.use('/api/sessions', sessions_routes_1.default);
app.use('/api/wordpress', wordpress_routes_1.default);
// 404 handler
app.use(error_middleware_1.notFoundHandler);
// Error handler (must be last)
app.use(error_middleware_1.errorHandler);
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${env_1.default.nodeEnv}`);
    console.log(`🌐 CORS allowed origins: ${env_1.default.cors.allowedOrigins.join(', ')}`);
    console.log(`🔒 Rate limit: ${env_1.default.rateLimit} requests/minute`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=index.js.map