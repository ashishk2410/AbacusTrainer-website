// WordPress API client for fetching blog posts
// Using WordPress.com public API for .wordpress.com sites
const WORDPRESS_SITE = 'abacustrainernetlify.wordpress.com';
const WORDPRESS_API_URL = `https://public-api.wordpress.com/rest/v1.1/sites/${WORDPRESS_SITE}`;

export interface WordPressPost {
  ID: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    ID: number;
    name: string;
    URL: string;
  };
  featured_image?: string;
  post_thumbnail?: {
    URL: string;
  };
  categories?: {
    [key: string]: string;
  };
  tags?: {
    [key: string]: string;
  };
  // Legacy format support
  id?: number;
  date_gmt?: string;
  modified_gmt?: string;
  title?: {
    rendered: string;
  };
  content?: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  author?: number;
  featured_media?: number;
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      url: string;
    }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any;
}

export async function getWordPressPosts(
  page: number = 1,
  perPage: number = 10
): Promise<{ posts: WordPressPost[]; total: number; totalPages: number }> {
  try {
    // Try WordPress.com API first
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?number=${perPage}&page=${page}&status=publish&order_by=date&order=DESC`,
      {
        next: { revalidate: 300 } // Revalidate every 5 minutes for faster updates
      }
    );

    if (!response.ok) {
      // Fallback to standard WordPress REST API
      const fallbackResponse = await fetch(
        `https://${WORDPRESS_SITE}/wp-json/wp/v2/posts?_embed&page=${page}&per_page=${perPage}&status=publish`,
        {
          next: { revalidate: 300 }
        }
      );

      if (!fallbackResponse.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const allPosts: WordPressPost[] = await fallbackResponse.json();
      
      // Filter to ensure only published posts are returned (extra safety check)
      const posts = allPosts.filter(post => {
        const status = post.status || (post as any).status;
        return status === 'publish';
      });
      const total = parseInt(fallbackResponse.headers.get('x-wp-total') || '0', 10);
      const totalPages = parseInt(fallbackResponse.headers.get('x-wp-totalpages') || '0', 10);

      return { posts, total, totalPages };
    }

    const data = await response.json();
    const allPosts: WordPressPost[] = data.posts || [];
    
    // Filter to ensure only published posts are returned (extra safety check)
    const posts = allPosts.filter(post => post.status === 'publish');
    const total = data.found || posts.length;
    const totalPages = Math.ceil(total / perPage);

    return { posts, total, totalPages };
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return { posts: [], total: 0, totalPages: 0 };
  }
}

export async function getWordPressPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    // Try WordPress.com API first
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts/slug:${slug}`,
      {
        next: { revalidate: 300 } // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      // Fallback to standard WordPress REST API
      const fallbackResponse = await fetch(
        `https://${WORDPRESS_SITE}/wp-json/wp/v2/posts?slug=${slug}&_embed&status=publish`,
        {
          next: { revalidate: 300 }
        }
      );

      if (!fallbackResponse.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const posts: WordPressPost[] = await fallbackResponse.json();
      
      // Filter to ensure only published posts are returned
      const publishedPosts = posts.filter(post => {
        const status = post.status || (post as any).status;
        return status === 'publish';
      });
      
      return publishedPosts.length > 0 ? publishedPosts[0] : null;
    }

    const post: WordPressPost = await response.json();
    
    // Ensure only published posts are returned (WordPress.com API should only return published, but check anyway)
    if (post && post.status === 'publish') {
      return post;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching WordPress post:', error);
    return null;
  }
}

export async function getWordPressCategories(): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/categories`,
      {
        next: { revalidate: 3600 } // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching WordPress categories:', error);
    return [];
  }
}

// Helper function to strip HTML tags and get plain text excerpt
export function getExcerpt(text: string, length: number = 150): string {
  const stripped = text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ');
  return stripped.length > length ? stripped.substring(0, length) + '...' : stripped;
}

// Helper function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

