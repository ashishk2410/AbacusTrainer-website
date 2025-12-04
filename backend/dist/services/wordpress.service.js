"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordpressService = void 0;
// WordPress service - proxies WordPress REST API calls
const axios_1 = __importDefault(require("axios"));
const env_1 = __importDefault(require("../config/env"));
class WordPressService {
    constructor() {
        if (!env_1.default.wordpress.url) {
            throw new Error('WORDPRESS_URL is not configured');
        }
        this.baseUrl = env_1.default.wordpress.url.replace(/\/$/, ''); // Remove trailing slash
        this.client = axios_1.default.create({
            baseURL: `${this.baseUrl}/wp-json/wp/v2`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                ...(env_1.default.wordpress.apiKey && {
                    Authorization: `Bearer ${env_1.default.wordpress.apiKey}`,
                }),
            },
        });
    }
    /**
     * Get WordPress posts with pagination and filtering
     */
    async getPosts(page = 1, perPage = 10, category, search) {
        try {
            const params = {
                page,
                per_page: perPage,
                _embed: true, // Include embedded data (author, featured image)
            };
            if (category) {
                params.categories = category;
            }
            if (search) {
                params.search = search;
            }
            const response = await this.client.get('/posts', { params });
            // Get total count from headers
            const total = parseInt(response.headers['x-wp-total'] || '0', 10);
            const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);
            return {
                posts: response.data,
                total,
                totalPages,
            };
        }
        catch (error) {
            console.error('Error fetching WordPress posts:', error);
            if (error.response) {
                throw new Error(`WordPress API error: ${error.response.status} ${error.response.statusText}`);
            }
            throw new Error('Failed to fetch WordPress posts');
        }
    }
    /**
     * Get WordPress post by slug
     */
    async getPostBySlug(slug) {
        try {
            const response = await this.client.get('/posts', {
                params: {
                    slug,
                    _embed: true,
                },
            });
            if (response.data.length === 0) {
                return null;
            }
            return response.data[0];
        }
        catch (error) {
            console.error('Error fetching WordPress post:', error);
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch WordPress post');
        }
    }
    /**
     * Get WordPress categories
     */
    async getCategories() {
        try {
            const response = await this.client.get('/categories', {
                params: {
                    per_page: 100, // Get all categories
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching WordPress categories:', error);
            throw new Error('Failed to fetch WordPress categories');
        }
    }
    /**
     * Sanitize WordPress post content
     * Remove potentially dangerous HTML/scripts
     */
    sanitizeContent(html) {
        // Basic sanitization - remove script tags and dangerous attributes
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
            .replace(/on\w+='[^']*'/gi, '') // Remove event handlers
            .trim();
    }
}
exports.wordpressService = new WordPressService();
//# sourceMappingURL=wordpress.service.js.map