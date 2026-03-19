// CreatePost.tsx - VERSÃO FUNCIONAL
import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageIcon, Smile, Sparkles } from 'lucide-react';

interface CreatePostProps {
  currentUser: any;
  onCreatePost: (content: string) => void;
}

export function CreatePost({ currentUser, onCreatePost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      await onCreatePost(content);
      setContent('');
      
      // Efeito de confete (se tiver)
      if ((window as any).confetti) {
        (window as any).confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Erro ao criar post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  // Garante que currentUser existe
  const user = currentUser || { 
    name: 'Usuário', 
    avatar: '',
    username: 'usuario'
  };

  return (
    <div className="border-b border-purple-200 p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
      <div className="flex gap-4">
        <Avatar className="border-2 border-purple-300">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <textarea
            placeholder="🎉 Compartilhe a alegria da festa!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full min-h-[100px] resize-none border-0 focus:outline-none p-0 bg-transparent text-gray-900 placeholder-purple-400 text-lg"
            disabled={loading}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-600 hover:bg-purple-100 transition-all hover:scale-105"
                disabled={loading}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-pink-600 hover:bg-pink-100 transition-all hover:scale-105"
                disabled={loading}
              >
                <Smile className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-yellow-600 hover:bg-yellow-100 transition-all hover:scale-105"
                disabled={loading}
              >
                <Sparkles className="w-5 h-5" />
              </Button>
            </div>
            
            <Button 
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Postando...
                </div>
              ) : (
                '🎊 Pulsar'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}