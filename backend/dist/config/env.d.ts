export declare const env: {
    PORT: string;
    NODE_ENV: "development" | "production" | "test";
    FIREBASE_PROJECT_ID: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_EMAIL: string;
    JWT_SECRET: string;
    API_RATE_LIMIT: string;
    ALLOWED_ORIGINS: string;
    LOG_LEVEL: "error" | "warn" | "info" | "debug";
    WORDPRESS_URL?: string | undefined;
    WORDPRESS_API_KEY?: string | undefined;
};
declare const _default: {
    readonly port: number;
    readonly nodeEnv: "development" | "production" | "test";
    readonly firebase: {
        readonly projectId: string;
        readonly privateKey: string;
        readonly clientEmail: string;
    };
    readonly wordpress: {
        readonly url: string | undefined;
        readonly apiKey: string | undefined;
    };
    readonly jwt: {
        readonly secret: string;
    };
    readonly rateLimit: number;
    readonly cors: {
        readonly allowedOrigins: string[];
    };
    readonly logLevel: "error" | "warn" | "info" | "debug";
};
export default _default;
//# sourceMappingURL=env.d.ts.map