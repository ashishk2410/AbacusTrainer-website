"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.getPostBySlug = exports.getPosts = void 0;
const wordpress_service_1 = require("../services/wordpress.service");
/**
 * Get WordPress posts
 */
const getPosts = async (req, res) => {
    try {
        const { page = 1, per_page = 10, categories, search } = req.query;
        const pageNum = typeof page === 'string' ? parseInt(page, 10) : (typeof page === 'number' ? page : 1);
        const perPageNum = typeof per_page === 'string' ? parseInt(per_page, 10) : (typeof per_page === 'number' ? per_page : 10);
        const categoryId = categories ? (typeof categories === 'string' ? parseInt(categories, 10) : (typeof categories === 'number' ? categories : undefined)) : undefined;
        const searchQuery = typeof search === 'string' ? search : undefined;
        const result = await wordpress_service_1.wordpressService.getPosts(pageNum, perPageNum, categoryId, searchQuery);
        // Sanitize post content
        const sanitizedPosts = result.posts.map((post) => ({
            ...post,
            content: {
                rendered: wordpress_service_1.wordpressService.sanitizeContent(post.content.rendered),
            },
            excerpt: {
                rendered: wordpress_service_1.wordpressService.sanitizeContent(post.excerpt.rendered),
            },
        }));
        res.json({
            data: {
                posts: sanitizedPosts,
                total: result.total,
                totalPages: result.totalPages,
            },
        });
    }
    catch (error) {
        console.error('Get WordPress posts error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch WordPress posts',
            code: 'FETCH_POSTS_FAILED',
        });
    }
};
exports.getPosts = getPosts;
/**
 * Get WordPress post by slug
 */
const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            res.status(400).json({
                error: 'Slug parameter is required',
                code: 'MISSING_SLUG',
            });
            return;
        }
        const post = await wordpress_service_1.wordpressService.getPostBySlug(slug);
        if (!post) {
            res.status(404).json({
                error: 'Post not found',
                code: 'POST_NOT_FOUND',
            });
            return;
        }
        // Sanitize post content
        const sanitizedPost = {
            ...post,
            content: {
                rendered: wordpress_service_1.wordpressService.sanitizeContent(post.content.rendered),
            },
            excerpt: {
                rendered: wordpress_service_1.wordpressService.sanitizeContent(post.excerpt.rendered),
            },
        };
        res.json({
            data: {
                post: sanitizedPost,
            },
        });
    }
    catch (error) {
        console.error('Get WordPress post error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch WordPress post',
            code: 'FETCH_POST_FAILED',
        });
    }
};
exports.getPostBySlug = getPostBySlug;
/**
 * Get WordPress categories
 */
const getCategories = async (_req, res) => {
    try {
        const categories = await wordpress_service_1.wordpressService.getCategories();
        res.json({
            data: {
                categories,
            },
        });
    }
    catch (error) {
        console.error('Get WordPress categories error:', error);
        res.status(500).json({
            error: error.message || 'Failed to fetch WordPress categories',
            code: 'FETCH_CATEGORIES_FAILED',
        });
    }
};
exports.getCategories = getCategories;
//# sourceMappingURL=wordpress.controller.js.map