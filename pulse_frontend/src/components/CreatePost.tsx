import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageIcon, Smile, Sparkles, X } from 'lucide-react';

interface CreatePostProps {
  currentUser: any;
  onCreatePost: (content: string, image?: File) => void;
}

export function CreatePost({ currentUser, onCreatePost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = currentUser || { name: 'Usuário', avatar: '', username: 'usuario' };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageFile) return;
    setLoading(true);
    try {
      await onCreatePost(content, imageFile || undefined);
      setContent('');
      removeImage();
      if ((window as any).confetti) {
        (window as any).confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Erro ao criar post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-purple-100 p-5 bg-white">
      <div className="flex gap-4">
        <Avatar className="border-2 border-purple-300 shrink-0">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <textarea
            placeholder="O que está acontecendo na festa? ✨"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.ctrlKey || e.metaKey) && handleSubmit()}
            className="w-full min-h-[90px] resize-none border-0 focus:outline-none bg-transparent text-gray-900 placeholder-gray-400 text-lg"
            disabled={loading}
          />

          {/* Preview da imagem */}
          {imagePreview && (
            <div className="relative mt-2 mb-3 inline-block">
              <img
                src={imagePreview}
                alt="preview"
                className="max-h-48 rounded-xl object-cover border border-purple-100"
              />
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 bg-gray-900/70 text-white rounded-full p-1 hover:bg-gray-900 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-100">
            <div className="flex gap-1">
              <Button
                variant="ghost" size="sm"
                className="text-purple-500 hover:bg-purple-50"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <Button variant="ghost" size="sm" className="text-pink-500 hover:bg-pink-50" disabled={loading}>
                <Smile className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-yellow-500 hover:bg-yellow-50" disabled={loading}>
                <Sparkles className="w-5 h-5" />
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageFile) || loading}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 shadow-md hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Postando...
                </span>
              ) : '✨ Pulsar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}