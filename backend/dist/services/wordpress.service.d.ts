import { WordPressPost, WordPressCategory } from '../types';
declare class WordPressService {
    private client;
    private baseUrl;
    constructor();
    /**
     * Get WordPress posts with pagination and filtering
     */
    getPosts(page?: number, perPage?: number, category?: number, search?: string): Promise<{
        posts: WordPressPost[];
        total: number;
        totalPages: number;
    }>;
    /**
     * Get WordPress post by slug
     */
    getPostBySlug(slug: string): Promise<WordPressPost | null>;
    /**
     * Get WordPress categories
     */
    getCategories(): Promise<WordPressCategory[]>;
    /**
     * Sanitize WordPress post content
     * Remove potentially dangerous HTML/scripts
     */
    sanitizeContent(html: string): string;
}
export declare const wordpressService: WordPressService;
export {};
//# sourceMappingURL=wordpress.service.d.ts.map