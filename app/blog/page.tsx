import { Metadata } from 'next';
import Link from 'next/link';
import { getWordPressPosts, getExcerpt, formatDate } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Blog - Latest News & Updates | Abacus Trainer',
  description: 'Read the latest blog posts, news, and updates about Abacus Trainer. Learn about mental math training, abacus learning tips, app features, and educational insights.',
  keywords: [
    'abacus trainer blog',
    'mental math blog',
    'abacus learning tips',
    'math education news',
    'abacus training updates',
    'educational app blog'
  ],
  openGraph: {
    title: 'Blog - Abacus Trainer News & Updates',
    description: 'Latest blog posts, news, and updates about Abacus Trainer and mental math training.',
    url: 'https://abacustrainer.netlify.app/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://abacustrainer.netlify.app/blog',
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  let posts: any[] = [];
  let total = 0;
  let totalPages = 0;
  
  try {
    const result = await getWordPressPosts(currentPage, 10);
    posts = result?.posts || [];
    total = result?.total || 0;
    totalPages = result?.totalPages || 0;
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    // Continue with empty posts array - don't throw to prevent 500 error
    posts = [];
    total = 0;
    totalPages = 0;
  }

  return (
    <div style={{ minHeight: '100vh', padding: '120px 0 80px', background: '#F9FAFB' }}>
      <div className="container">
        {/* Blog Posts List */}
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No blog posts found.</p>
            <p style={{ color: '#9CA3AF' }}>Check back soon for updates!</p>
          </div>
        ) : (
          <>
            <div className="blog-listing-grid">
              {posts.map((post, index) => {
                // Safety check - ensure post exists
                if (!post) return null;
                
                try {
                  // Handle both WordPress.com API and standard WordPress REST API formats
                  const postId = post.ID || post.id || index;
                  const postTitle = typeof post.title === 'string' 
                    ? post.title 
                    : (typeof post.title === 'object' && post.title !== null && 'rendered' in post.title)
                      ? String(post.title.rendered)
                      : 'Untitled Post';
                  const postContent = typeof post.content === 'string' 
                    ? post.content 
                    : (typeof post.content === 'object' && post.content !== null && 'rendered' in post.content)
                      ? String(post.content.rendered)
                      : '';
                  const postExcerpt = typeof post.excerpt === 'string' 
                    ? post.excerpt 
                    : (typeof post.excerpt === 'object' && post.excerpt !== null && 'rendered' in post.excerpt)
                      ? String(post.excerpt.rendered)
                      : '';
                  const postDate = post.date || '';
                  const postSlug = post.slug || `post-${postId}`;
                  
                  // Get featured image - WordPress.com uses attachments, standard WP uses _embedded
                  let featuredImage: string | undefined;
                  try {
                    if ((post as any).attachments && Object.keys((post as any).attachments).length > 0) {
                      // WordPress.com format - get first attachment URL
                      const firstAttachment = Object.values((post as any).attachments)[0] as any;
                      featuredImage = firstAttachment?.URL || firstAttachment?.thumbnails?.large;
                    } else if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
                      // Standard WordPress REST API format
                      featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
                    } else if ((post as any).featured_image) {
                      featuredImage = (post as any).featured_image;
                    }
                  } catch (imgError) {
                    // Ignore image errors
                    console.warn('Error extracting featured image:', imgError);
                  }
                  
                  // Get author - WordPress.com has author object, standard WP uses _embedded
                  const author = (post as any).author?.name || post._embedded?.author?.[0]?.name;
                  
                  // Ensure we have a string for excerpt
                  const excerptText = postExcerpt || postContent || '';
                  const excerpt = getExcerpt(excerptText, 200);

                // Use default image if no featured image
                const displayImage = featuredImage || '/images/phone-mockup.png';
                const cleanTitle = postTitle.replace(/<[^>]*>/g, '');

                return (
                  <Link
                    key={postId}
                    href={`/blog/${postSlug}`}
                    className="blog-post-card-link"
                  >
                    <article className="blog-post-card">
                      <div className="blog-post-image">
                        <img
                          src={displayImage}
                          alt={cleanTitle}
                        />
                      </div>
                      <div className="blog-post-content-wrapper">
                        <h2 className="blog-post-title">
                          <span dangerouslySetInnerHTML={{ __html: postTitle }} />
                        </h2>
                        <div
                          className="blog-post-excerpt"
                          dangerouslySetInnerHTML={{ __html: excerpt }}
                        />
                      </div>
                    </article>
                  </Link>
                );
                } catch (postError) {
                  // Log error but don't break the page - return null for this post
                  console.error('Error rendering blog post:', postError);
                  return null;
                }
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', marginTop: '3rem' }}>
                {currentPage > 1 && (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      background: 'white',
                      color: '#6366f1',
                      fontWeight: 600,
                      textDecoration: 'none',
                      border: '2px solid #E5E7EB',
                    }}
                  >
                    <i className="fas fa-chevron-left" style={{ marginRight: '0.5rem' }}></i>
                    Previous
                  </Link>
                )}
                <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      background: 'linear-gradient(135deg, #6366f1, #f59e0b)',
                      color: 'white',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Next
                    <i className="fas fa-chevron-right" style={{ marginLeft: '0.5rem' }}></i>
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
          <Link href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600, fontSize: '1.125rem' }}>
            <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

