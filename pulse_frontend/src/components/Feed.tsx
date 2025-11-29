import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import CreatePost from './CreatePost';
import  PostCard  from './PostCard';
import { postsAPI } from '../services/api';

interface FeedProps {
  currentUser: any;
  onLogout: () => void;
}

interface Post {
  id: string;
  author: any;
  content: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
  comments: any[];
  image?: string;
}

export default function Feed({ currentUser, onLogout }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carregar posts da API
  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getFeed();
      console.log('📦 Posts carregados:', response);
      
      // Adaptar a resposta da API para o formato do frontend
      const adaptedPosts = response.results || response.map((post: any) => ({
        id: post.id.toString(),
        author: post.author,
        content: post.content,
        timestamp: post.created_at || post.timestamp,
        likes: post.likes_count || post.likes,
        likedBy: post.liked_by || [],
        comments: post.comments || [],
        image: post.image
      }));
      
      setPosts(adaptedPosts);
    } catch (err) {
      console.error('❌ Erro ao carregar posts:', err);
      setError('Erro ao carregar o feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (content: string) => {
    try {
      const postData = new FormData();
      postData.append('content', content);
      
      const newPost = await postsAPI.createPost(postData);
      console.log('✅ Post criado:', newPost);
      
      // Recarregar posts
      await loadPosts();
    } catch (err) {
      console.error('❌ Erro ao criar post:', err);
      alert('Erro ao criar post');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await postsAPI.likePost(parseInt(postId));
      // Recarregar posts para atualizar likes
      await loadPosts();
    } catch (err) {
      console.error('❌ Erro ao curtir post:', err);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      // TODO: Implementar API de comentários
      console.log(`Comentário no post ${postId}: ${content}`);
      // Por enquanto, atualiza localmente
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: Math.random().toString(36).substr(2, 9),
            author: currentUser,
            content,
            timestamp: new Date().toISOString()
          };
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('❌ Erro ao comentar:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={loadPosts}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex max-w-7xl mx-auto">
        <Sidebar currentUser={currentUser} onLogout={onLogout} />
        
        <main className="flex-1 border-x border-gray-200 bg-white min-h-screen">
          <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
            <h2 className="text-xl font-bold">Início</h2>
          </div>

          <CreatePost currentUser={currentUser} onCreatePost={handleCreatePost} />

          <div className="divide-y divide-gray-200">
            {posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Nenhum post encontrado. Seja o primeiro a publicar!</p>
              </div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))
            )}
          </div>
        </main>

        <aside className="hidden lg:block w-80 p-4">
          <div className="bg-gray-100 rounded-2xl p-4 sticky top-4">
            <h3 className="font-bold mb-4">O que está acontecendo</h3>
            <div className="space-y-4">
              <div className="hover:bg-gray-200 p-3 rounded-lg cursor-pointer transition-colors">
                <p className="text-gray-600 text-sm">Trending no Brasil</p>
                <p className="text-gray-900 font-medium">#PulseApp</p>
                <p className="text-gray-600 text-sm">12.5k pulses</p>
              </div>
              <div className="hover:bg-gray-200 p-3 rounded-lg cursor-pointer transition-colors">
                <p className="text-gray-600 text-sm">Tecnologia · Trending</p>
                <p className="text-gray-900 font-medium">#React</p>
                <p className="text-gray-600 text-sm">8.3k pulses</p>
              </div>
              <div className="hover:bg-gray-200 p-3 rounded-lg cursor-pointer transition-colors">
                <p className="text-gray-600 text-sm">Esportes · Trending</p>
                <p className="text-gray-900 font-medium">#Futebol</p>
                <p className="text-gray-600 text-sm">15.2k pulses</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}