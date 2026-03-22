import { useEffect, useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Loader2, AlertCircle } from 'lucide-react';
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

export default function FacebookFeed() {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFacebookPosts()
      .then(({ posts: initialPosts, nextCursor: cursor }) => {
        setPosts(initialPosts);
        setNextCursor(cursor);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load posts.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLoadMore = () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    fetchFacebookPosts(nextCursor)
      .then(({ posts: morePosts, nextCursor: cursor }) => {
        setPosts((prev) => [...prev, ...morePosts]);
        setNextCursor(cursor);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load more posts.');
      })
      .finally(() => setLoadingMore(false));
  };

  return (
    <section className="py-24 bg-brand-darker border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-orange font-bold uppercase tracking-widest text-sm">
            Social Updates
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter">
            Latest from <span className="text-brand-orange">The Lab</span>
          </h2>
          <div className="w-24 h-1 bg-brand-orange mx-auto mt-6"></div>
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

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const images = getPostImages(post);
                const postUrl = getPostUrl(post.id);
                const readableDate = new Date(post.created_time).toLocaleString();
                const likesCount = post.likes?.summary?.total_count ?? 0;
                const commentsCount = post.comments?.summary?.total_count ?? 0;
                const sharesCount = post.shares?.count ?? 0;

                return (
                  <div
                  key={post.id}
                  className="bg-brand-dark border border-gray-800 rounded-sm overflow-hidden flex flex-col"
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between border-b border-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center font-display font-bold text-white text-xs">
                        1625
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">1625 Auto Lab</h4>
                        <span className="text-gray-500 text-xs">{readableDate}</span>
                      </div>
                    </div>
                    <a
                      href={postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-white transition-colors"
                      aria-label="View on Facebook"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Post Content */}
                  <div className="p-4 flex-grow">
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
                      {post.message ?? 'No caption'}
                    </p>
                  </div>

                  {/* Post Images */}
                  {images.length > 0 && (
                    <div className="w-full aspect-video bg-brand-gray overflow-hidden">
                      <img
                        src={images[0]}
                        alt="Post attachment"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Post Stats & Actions */}
                  <div className="p-4 bg-brand-darker/50">
                    <div className="flex items-center justify-between text-gray-400 text-xs mb-3 pb-3 border-b border-gray-800">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-brand-orange" /> {likesCount}
                      </span>
                      <span>{commentsCount} Comments</span>
                      <span>{sharesCount} Shares</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <a
                        href={postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-brand-orange transition-colors text-xs sm:text-sm font-bold uppercase tracking-wider"
                      >
                        <ThumbsUp className="w-4 h-4" /> <span className="hidden sm:inline">Like</span>
                      </a>
                      <a
                        href={postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm font-bold uppercase tracking-wider"
                      >
                        <MessageCircle className="w-4 h-4" /> <span className="hidden sm:inline">Comment</span>
                      </a>
                      <a
                        href={postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 sm:gap-2 text-gray-400 hover:text-white transition-colors text-xs sm:text-sm font-bold uppercase tracking-wider"
                      >
                        <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
                      </a>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {nextCursor && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-3 bg-brand-orange text-white font-bold uppercase tracking-widest text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
