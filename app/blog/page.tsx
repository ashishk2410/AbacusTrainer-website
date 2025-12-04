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
    <div style={{ minHeight: '100vh', padding: '180px 0 40px', background: '#F9FAFB' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Blog Posts List */}
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No blog posts found.</p>
            <p style={{ color: '#9CA3AF' }}>Check back soon for updates!</p>
          </div>
        ) : (
          <>
            <div className="blog-listing-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2.5rem',
              marginBottom: '5rem'
            }}>
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

                return (
                  <article
                    key={postId}
                    className="blog-post-card"
                    style={{
                      background: 'white',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                  >
                    {featuredImage && (
                      <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
                        <img
                          src={featuredImage}
                          alt={postTitle.replace(/<[^>]*>/g, '')}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}
                    <div style={{ padding: '2rem 2.5rem' }}>
                      <div style={{ 
                        marginBottom: '1.5rem', 
                        display: 'flex', 
                        gap: '1rem', 
                        alignItems: 'center', 
                        fontSize: '0.875rem', 
                        color: '#6B7280',
                        fontFamily: 'var(--font-primary)',
                        lineHeight: '1.6',
                        fontWeight: 400
                      }}>
                        <span>{formatDate(postDate)}</span>
                        {author && (
                          <>
                            <span style={{ color: '#D1D5DB' }}>•</span>
                            <span>By {author}</span>
                          </>
                        )}
                      </div>
                      <h2 style={{ 
                        fontSize: '1.625rem', 
                        fontWeight: 700, 
                        marginBottom: '1.5rem', 
                        color: '#1F2937',
                        fontFamily: 'var(--font-secondary)',
                        lineHeight: '1.4',
                        letterSpacing: '-0.01em'
                      }}>
                        <Link
                          href={`/blog/${postSlug}`}
                          style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                        >
                          <span dangerouslySetInnerHTML={{ __html: postTitle }} />
                        </Link>
                      </h2>
                      <div
                        style={{
                          color: '#4B5563',
                          lineHeight: '1.75',
                          marginBottom: '2rem',
                          fontSize: '1rem',
                          fontFamily: 'var(--font-primary)',
                          fontWeight: 400
                        }}
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                      />
                      <Link
                        href={`/blog/${postSlug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#6366f1',
                          fontWeight: 600,
                          textDecoration: 'none',
                          fontSize: '1rem',
                        }}
                      >
                        Read more
                        <i className="fas fa-arrow-right" style={{ fontSize: '0.875rem' }}></i>
                      </Link>
                    </div>
                  </article>
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

