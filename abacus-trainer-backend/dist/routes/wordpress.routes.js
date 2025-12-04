"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// WordPress routes
const express_1 = require("express");
const wordpress_controller_1 = require("../controllers/wordpress.controller");
const router = (0, express_1.Router)();
// WordPress routes are public (no authentication required)
/**
 * GET /api/wordpress/posts
 * Get WordPress blog posts
 * Query params: page, per_page, categories, search
 */
router.get('/posts', wordpress_controller_1.getPosts);
/**
 * GET /api/wordpress/posts/:slug
 * Get WordPress post by slug
 */
router.get('/posts/:slug', wordpress_controller_1.getPostBySlug);
/**
 * GET /api/wordpress/categories
 * Get WordPress categories
 */
router.get('/categories', wordpress_controller_1.getCategories);
exports.default = router;
//# sourceMappingURL=wordpress.routes.js.map