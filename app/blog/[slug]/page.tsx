import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWordPressPostBySlug, formatDate } from '@/lib/wordpress';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getWordPressPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Abacus Trainer Blog',
    };
  }

  // Handle both formats - WordPress.com API (string) or standard WP REST API (object with rendered)
  const postTitle = typeof post.title === 'string' ? post.title : (typeof post.title === 'object' && post.title !== null ? post.title.rendered : '');
  const postExcerpt = typeof post.excerpt === 'string' ? post.excerpt : (typeof post.excerpt === 'object' && post.excerpt !== null ? post.excerpt.rendered : '');
  const excerpt = String(postExcerpt).replace(/<[^>]*>/g, '').substring(0, 160);
  
  let featuredImage: string | undefined;
  if ((post as any).attachments && Object.keys((post as any).attachments).length > 0) {
    const firstAttachment = Object.values((post as any).attachments)[0] as any;
    featuredImage = firstAttachment?.URL || firstAttachment?.thumbnails?.large;
  } else if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
  }
  
  const author = (post as any).author?.name || post._embedded?.author?.[0]?.name;

  return {
    title: `${postTitle.replace(/<[^>]*>/g, '')} | Abacus Trainer Blog`,
    description: excerpt,
    openGraph: {
      title: postTitle.replace(/<[^>]*>/g, ''),
      description: excerpt,
      url: `https://abacustrainer.netlify.app/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified || post.date,
      authors: author ? [author] : [],
      images: featuredImage ? [featuredImage] : [],
    },
    alternates: {
      canonical: `https://abacustrainer.netlify.app/blog/${params.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getWordPressPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Handle both WordPress.com API and standard WordPress REST API formats
  // WordPress.com API returns strings, standard WP REST API returns objects with rendered property
  const postTitle = typeof post.title === 'string' ? post.title : (typeof post.title === 'object' && post.title !== null ? post.title.rendered : '');
  const postContent = typeof post.content === 'string' ? post.content : (typeof post.content === 'object' && post.content !== null ? post.content.rendered : '');
  const postExcerpt = typeof post.excerpt === 'string' ? post.excerpt : (typeof post.excerpt === 'object' && post.excerpt !== null ? post.excerpt.rendered : '');
  const postDate = post.date || '';
  
  // Get featured image - WordPress.com uses attachments, standard WP uses _embedded
  let featuredImage: string | undefined;
  if ((post as any).attachments && Object.keys((post as any).attachments).length > 0) {
    const firstAttachment = Object.values((post as any).attachments)[0] as any;
    featuredImage = firstAttachment?.URL || firstAttachment?.thumbnails?.large;
  } else if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
  } else if ((post as any).featured_image) {
    featuredImage = (post as any).featured_image;
  }
  
  // Get author - WordPress.com has author object, standard WP uses _embedded
  const author = (post as any).author?.name || post._embedded?.author?.[0]?.name;

  return (
    <>
      {/* Structured Data for Blog Post */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": postTitle.replace(/<[^>]*>/g, ''),
            "description": postExcerpt.replace(/<[^>]*>/g, ''),
            "datePublished": postDate,
            "dateModified": post.modified || postDate,
            "author": {
              "@type": "Person",
              "name": author || "Abacus Trainer"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Abacus Trainer",
              "logo": {
                "@type": "ImageObject",
                "url": "https://abacustrainer.netlify.app/images/logo.svg"
              }
            },
            "image": featuredImage || "https://abacustrainer.netlify.app/images/phone-mockup.png",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://abacustrainer.netlify.app/blog/${params.slug}`
            }
          })
        }}
      />

      <div style={{ minHeight: '100vh', padding: '180px 20px 40px', background: '#F9FAFB' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Back to Blog */}
          <div style={{ marginBottom: '2rem' }}>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Blog
            </Link>
          </div>

          {/* Blog Post */}
          <article style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
            {featuredImage && (
              <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
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

            <div style={{ padding: '3rem 3.5rem' }}>
              {/* Post Meta */}
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem', color: '#6B7280', flexWrap: 'wrap' }}>
                <span>{formatDate(postDate)}</span>
                {author && (
                  <>
                    <span>•</span>
                    <span>By {author}</span>
                  </>
                )}
              </div>

              {/* Post Title */}
              <h1
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  marginBottom: '2rem',
                  color: '#1F2937',
                  lineHeight: '1.2',
                  fontFamily: 'var(--font-secondary)',
                }}
                dangerouslySetInnerHTML={{ __html: postTitle }}
              />

              {/* Post Content */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: postContent }}
              />
            </div>
          </article>

          {/* Navigation */}
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <i className="fas fa-arrow-left"></i>
              All Posts
            </Link>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <i className="fas fa-home"></i>
              Home
            </Link>
          </div>
        </div>
      </div>

    </>
  );
}

