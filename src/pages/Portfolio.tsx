import { useEffect, useMemo, useState } from 'react';
import { Calendar, ThumbsUp, MessageCircle, Share2, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FacebookPost } from '../types';
import { fetchFacebookPosts } from '../services/api';

function getPostUrl(postId: string): string {
  const parts = postId.split('_');
  return parts.length === 2
    ? `https://www.facebook.com/${parts[0]}/posts/${parts[1]}`
    : `https://www.facebook.com/${postId}`;
}

function getPostImages(post: FacebookPost): string[] {
  const subattachments = post.attachments?.data?.[0]?.subattachments?.data;
  if (subattachments && subattachments.length > 0) {
    return subattachments
      .map((sub) => sub.media?.image?.src)
      .filter((src): src is string => Boolean(src));
  }
  const single =
    post.full_picture ?? post.attachments?.data?.[0]?.media?.image?.src ?? null;
  return single ? [single] : [];
}

/**
 * Determines whether a Facebook post should appear in the Portfolio page.
 *
 * A post qualifies if it meets at least one of:
 *  1. Its message contains the #portfolio hashtag (added by admins to explicitly
 *     tag portfolio posts).
 *  2. It has more than 2 images (carousel / album with 3+ photos).
 *  3. It has a long caption (≥ 100 characters) that contains at least one hashtag
 *     — characteristic of detailed portfolio showcase posts.
 */
function isPortfolioPost(post: FacebookPost): boolean {
  const message = post.message ?? '';
  const images = getPostImages(post);

  if (/#portfolio\b/i.test(message)) return true;
  if (images.length > 2) return true;
  if (message.length >= 100 && /#\w+/.test(message)) return true;

  return false;
}

export default function Portfolio() {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const portfolioPosts = useMemo(() => posts.filter(isPortfolioPost), [posts]);
  const [visibleCount, setVisibleCount] = useState(5);

  const visiblePosts = portfolioPosts.slice(0, visibleCount);
  const hasMoreVisible = visibleCount < portfolioPosts.length || Boolean(nextCursor);

  const handleShowMore = () => {
    const nextVisible = visibleCount + 5;
    // If we already have enough filtered posts loaded, just reveal them
    if (nextVisible <= portfolioPosts.length) {
      setVisibleCount(nextVisible);
      return;
    }
    // Otherwise fetch the next page from FB (if available) and reveal
    if (!nextCursor || loadingMore) {
      setVisibleCount(nextVisible);
      return;
    }
    setLoadingMore(true);
    fetchFacebookPosts(nextCursor)
      .then(({ posts: morePosts, nextCursor: cursor }) => {
        setPosts((prev) => [...prev, ...morePosts]);
        setNextCursor(cursor);
        setVisibleCount(nextVisible);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load more posts.');
      })
      .finally(() => setLoadingMore(false));
  };

  useEffect(() => {
    fetchFacebookPosts()
      .then(({ posts: initialPosts, nextCursor: cursor }) => {
        setPosts(initialPosts);
        setNextCursor(cursor);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-darker">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-brand-orange font-bold uppercase tracking-widest text-sm block mb-2">
            Recent Builds
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tighter mb-6">
            Our <span className="text-brand-orange">Portfolio</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Check out some of our recent installations and upgrades. Does your car also need a Full Setup?
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-gray-400">{error}</p>
          </div>
        )}

        {!loading && !error && portfolioPosts.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-gray-400">No portfolio posts available yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && portfolioPosts.length > 0 && (
          <>
            <div className="space-y-16">
              {visiblePosts.map((post, index) => {
              const images = getPostImages(post);
              const postUrl = getPostUrl(post.id);
              const readableDate = new Date(post.created_time).toLocaleString();
              const likesCount = post.likes?.summary?.total_count ?? 0;
              const commentsCount = post.comments?.summary?.total_count ?? 0;
              const sharesCount = post.shares?.count ?? 0;
              const message = post.message ?? '';

              return (
                <div
                  key={post.id}
                  className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  {/* Images */}
                  {images.length > 0 && (
                    <div className="w-full lg:w-1/2">
                      {images.length === 1 ? (
                        <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-gray-800 group">
                          <div className="absolute inset-0 bg-brand-orange/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <img
                            src={images[0]}
                            alt="Post attachment"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {images.slice(0, 4).map((src, i) => (
                            <div key={i} className="relative aspect-square rounded-sm overflow-hidden border border-gray-800 group">
                              <div className="absolute inset-0 bg-brand-orange/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <img
                                src={src}
                                alt={`Post image ${i + 1}`}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className={`flex flex-col ${images.length > 0 ? 'w-full lg:w-1/2' : 'w-full'}`}>
                    <p className="text-gray-300 text-base leading-relaxed mb-6 whitespace-pre-wrap">
                      {message || 'No caption'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-gray-400 text-sm mb-6">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4 text-brand-orange" /> {likesCount} Likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" /> {commentsCount} Comments
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" /> {sharesCount} Shares
                      </span>
                    </div>

                    <small className="text-gray-500 block mb-8">{readableDate}</small>

                    <div className="mt-auto p-6 bg-brand-dark border border-gray-800 rounded-sm">
                      <h4 className="text-white font-bold mb-2">Planning to upgrade your vehicle?</h4>
                      <p className="text-gray-400 text-sm mb-4">Message us today to schedule your installation.</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          to="/booking"
                          className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-6 py-3 font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          Book This Setup
                        </Link>
                        <a
                          href={postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 border border-gray-700 text-gray-300 px-6 py-3 font-bold uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on Facebook
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMoreVisible && (
            <div className="flex justify-center mt-16">
              <button
                onClick={handleShowMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-8 py-3 bg-brand-orange text-white font-bold uppercase tracking-widest text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                  </>
                ) : (
                  'Show More'
                )}
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}
