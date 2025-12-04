"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
// Environment variable validation and type-safe access
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    // Server
    PORT: zod_1.z.string().default('3001'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    // Firebase Admin
    FIREBASE_PROJECT_ID: zod_1.z.string().min(1, 'FIREBASE_PROJECT_ID is required'),
    FIREBASE_PRIVATE_KEY: zod_1.z.string().min(1, 'FIREBASE_PRIVATE_KEY is required'),
    FIREBASE_CLIENT_EMAIL: zod_1.z.string().email('FIREBASE_CLIENT_EMAIL must be a valid email'),
    // WordPress
    WORDPRESS_URL: zod_1.z.string().url('WORDPRESS_URL must be a valid URL').optional(),
    WORDPRESS_API_KEY: zod_1.z.string().optional(),
    // Security
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    API_RATE_LIMIT: zod_1.z.string().default('100'),
    // CORS
    ALLOWED_ORIGINS: zod_1.z.string().min(1, 'ALLOWED_ORIGINS is required'),
    // Optional
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});
// Validate and parse environment variables
function validateEnv() {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error('❌ Invalid environment variables:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
}
exports.env = validateEnv();
// Type-safe environment access
exports.default = {
    port: parseInt(exports.env.PORT, 10),
    nodeEnv: exports.env.NODE_ENV,
    firebase: {
        projectId: exports.env.FIREBASE_PROJECT_ID,
        privateKey: exports.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: exports.env.FIREBASE_CLIENT_EMAIL,
    },
    wordpress: {
        url: exports.env.WORDPRESS_URL,
        apiKey: exports.env.WORDPRESS_API_KEY,
    },
    jwt: {
        secret: exports.env.JWT_SECRET,
    },
    rateLimit: parseInt(exports.env.API_RATE_LIMIT, 10),
    cors: {
        allowedOrigins: exports.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
    },
    logLevel: exports.env.LOG_LEVEL,
};
//# sourceMappingURL=env.js.map