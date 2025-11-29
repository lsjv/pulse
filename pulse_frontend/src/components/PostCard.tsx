import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';

interface PostCardProps {
  post: any;
  currentUser: any;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

export default function PostCard({ post, currentUser, onLike, onComment }: PostCardProps) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  // ✅ CORREÇÃO: Valores padrão para evitar undefined
  const safePost = {
    id: post.id || '',
    author: post.author || { name: 'Usuário', username: 'usuario' },
    content: post.content || '',
    timestamp: post.timestamp || post.created_at || new Date().toISOString(),
    likes: post.likes || post.likes_count || 0,
    likedBy: post.likedBy || post.liked_by || [],
    comments: post.comments || [],
    image: post.image
  };

  const hasLiked = safePost.likedBy.includes(currentUser?.id);
  const formattedTime = new Date(safePost.timestamp).toLocaleString('pt-BR');

  const handleLike = () => {
    onLike(safePost.id);
  };

  const handleCommentSubmit = () => {
    if (commentContent.trim()) {
      onComment(safePost.id, commentContent);
      setCommentContent('');
      setShowCommentInput(false);
    }
  };

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={safePost.author.avatar} />
          <AvatarFallback>
            {safePost.author.name?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{safePost.author.name || 'Usuário'}</span>
            <span className="text-gray-500">@{safePost.author.username || 'usuario'}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500 text-sm">{formattedTime}</span>
          </div>

          <p className="text-gray-900 mb-3 whitespace-pre-wrap">{safePost.content}</p>

          {safePost.image && (
            <div className="mb-3 rounded-2xl overflow-hidden border">
              <img 
                src={safePost.image} 
                alt="Post image" 
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-4 text-gray-500">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 ${hasLiked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{safePost.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowCommentInput(!showCommentInput)}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{safePost.comments.length}</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Repeat2 className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Share className="w-4 h-4" />
            </Button>
          </div>

          {showCommentInput && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Escreva um comentário..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
              />
              <Button onClick={handleCommentSubmit} size="sm">
                Comentar
              </Button>
            </div>
          )}

          {safePost.comments.length > 0 && (
            <div className="mt-4 space-y-3">
              {safePost.comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={comment.author?.avatar} />
                    <AvatarFallback>
                      {comment.author?.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.author?.name || 'Usuário'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(comment.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}