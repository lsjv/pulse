import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Share2, MoreHorizontal, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostCardProps {
  post: any;
  currentUser: any;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

export function PostCard({ post, currentUser, onLike, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showLikeAnim, setShowLikeAnim] = useState(false);

  const safePost = {
    id: post.id || '0',
    author: post.author || { name: 'Usuário', username: 'usuario', avatar: '' },
    content: post.content || '',
    likes_count: post.likes_count ?? post.likes ?? 0,
    comments_count: post.comments_count ?? post.comments?.length ?? 0,
    comments: post.comments || [],
    created_at: post.created_at || post.timestamp || new Date().toISOString(),
    liked_by_user: post.liked_by_user || post.likedBy?.includes(currentUser?.id) || false,
    image: post.image || null,
  };

  const handleLike = () => {
    onLike(safePost.id);
    if (!safePost.liked_by_user) {
      setShowLikeAnim(true);
      setTimeout(() => setShowLikeAnim(false), 800);
      if ((window as any).confetti) {
        (window as any).confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#9333ea', '#fbbf24'],
        });
      }
    }
  };

  const handleComment = () => {
    if (!commentContent.trim()) return;
    onComment(safePost.id, commentContent);
    setCommentContent('');
    setShowComments(false);
  };

  return (
    <article className="p-5 hover:bg-purple-50/30 transition-colors relative">
      {showLikeAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <Heart className="w-16 h-16 text-pink-500 fill-pink-500 animate-ping opacity-70" />
        </div>
      )}

      <div className="flex gap-3">
        <Avatar className="border-2 border-purple-200 shrink-0">
          <AvatarImage src={safePost.author.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            {safePost.author.name?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-gray-900">{safePost.author.name}</span>
              <span className="text-purple-500 text-sm">
                @{safePost.author.username || safePost.author.name?.toLowerCase().replace(/\s+/g, '')}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-400 text-sm">
                {formatDistanceToNow(new Date(safePost.created_at), { addSuffix: true, locale: ptBR })}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-600 hover:bg-purple-50 -mr-2">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Conteúdo */}
          <p className="text-gray-800 mt-2 whitespace-pre-wrap leading-relaxed">{safePost.content}</p>

          {/* Imagem do post */}
          {safePost.image && (
            <img
              src={safePost.image}
              alt="imagem do post"
              className="mt-3 rounded-2xl max-h-96 w-full object-cover border border-purple-100"
            />
          )}

          {/* Ações */}
          <div className="flex items-center gap-1 mt-4 -ml-2">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-purple-600 transition-colors group px-2 py-1.5 rounded-full hover:bg-purple-50"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">{safePost.comments_count}</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors group px-2 py-1.5 rounded-full ${
                safePost.liked_by_user
                  ? 'text-pink-600 hover:bg-pink-50'
                  : 'text-gray-400 hover:text-pink-600 hover:bg-pink-50'
              }`}
            >
              <Heart className={`w-4 h-4 group-hover:scale-110 transition-transform ${safePost.liked_by_user ? 'fill-current' : ''}`} />
              <span className="text-sm">{safePost.likes_count}</span>
            </button>

            <button className="flex items-center gap-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors group px-2 py-1.5 rounded-full">
              <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            <button className="flex items-center gap-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors group px-2 py-1.5 rounded-full ml-auto">
              <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Seção de comentários */}
          {showComments && (
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 border-2 border-purple-200 shrink-0">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                    {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    placeholder="Escreva sua resposta..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleComment()}
                    className="w-full min-h-[70px] resize-none border border-purple-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      onClick={handleComment}
                      disabled={!commentContent.trim()}
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-all hover:scale-105 text-xs px-4"
                    >
                      Responder
                    </Button>
                  </div>
                </div>
              </div>

              {safePost.comments.length > 0 && (
                <div className="space-y-3 pl-4 border-l-2 border-purple-100">
                  {safePost.comments.map((comment: any) => (
                    <div key={comment.id || Math.random()} className="flex gap-3">
                      <Avatar className="w-7 h-7 border border-purple-200 shrink-0">
                        <AvatarImage src={comment.author?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white text-xs">
                          {comment.author?.name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm text-gray-900">{comment.author?.name || 'Usuário'}</span>
                          <span className="text-gray-400 text-xs">
                            {formatDistanceToNow(new Date(comment.timestamp || comment.created_at), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mt-0.5">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}