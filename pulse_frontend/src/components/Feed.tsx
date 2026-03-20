import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import { postsAPI } from '../services/api';

interface FeedProps {
  currentUser: any;
  onLogout: () => void;
  onUpdateUser: (user: any) => void;
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

const TRENDING = [
  { category: 'Trending Brasil', tag: '#PulseFest', sub: 'Assunto do momento', color: 'purple' },
  { category: 'Tecnologia', tag: '#Django', sub: 'Desenvolvimento web', color: 'pink' },
  { category: 'Tecnologia', tag: '#ReactJS', sub: 'Desenvolvimento web', color: 'yellow' },
];

const dotColor: Record<string, string> = { purple: 'bg-purple-500', pink: 'bg-pink-500', yellow: 'bg-yellow-500' };
const textColor: Record<string, string> = { purple: 'text-purple-600', pink: 'text-pink-600', yellow: 'text-yellow-600' };
const borderHover: Record<string, string> = { purple: 'hover:border-purple-200', pink: 'hover:border-pink-200', yellow: 'hover:border-yellow-200' };

export default function Feed({ currentUser, onLogout, onUpdateUser }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getFeed();
      const adaptedPosts = (response.results || response).map((post: any) => ({
        id: post.id.toString(),
        author: post.author,
        content: post.content,
        timestamp: post.created_at || post.timestamp,
        likes: post.likes_count ?? post.likes ?? 0,
        likedBy: post.liked_by || [],
        comments: post.comments || [],
        image: post.image,
      }));
      setPosts(adaptedPosts);
    } catch (err: any) {
      setError('Erro ao carregar o feed. ' + (err.response?.data?.detail || ''));
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { usersAPI } = await import('../services/api');
      const response = await usersAPI.getUsers();
      const allUsers = response.results || response;
      setUsers(allUsers.filter((u: any) => u.id !== currentUser?.id).slice(0, 4));
    } catch {}
  };

  useEffect(() => { loadPosts(); loadUsers(); }, []);

  const handleCreatePost = async (content: string) => {
    try {
      await postsAPI.createPost(content);
      await loadPosts();
    } catch {
      alert('Erro ao criar post');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await postsAPI.likePost(postId);
      await loadPosts();
    } catch (err) {
      console.error('Erro ao curtir post:', err);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      await postsAPI.commentPost(postId, content);
      await loadPosts();
    } catch (err) {
      console.error('Erro ao comentar:', err);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const { usersAPI } = await import('../services/api');
      await usersAPI.followUser(userId);
      await loadUsers();
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Carregando feed...</p>
          <p className="text-sm text-gray-400">Preparando os confetes ✨</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-5xl mb-4">🎈</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Algo deu errado</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={loadPosts} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition">
              Tentar novamente
            </button>
            <button onClick={onLogout} className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-50 transition">
              Fazer login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex max-w-7xl mx-auto">
        <Sidebar currentUser={currentUser} onLogout={onLogout} onUpdateUser={onUpdateUser} />

        <main className="flex-1 border-x border-purple-100 bg-white/80 backdrop-blur-sm min-h-screen">
          <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-purple-100 px-6 py-4 z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ✨ Pulse Feed
            </h2>
            <p className="text-sm text-gray-400">O que está acontecendo?</p>
          </div>

          <CreatePost currentUser={currentUser} onCreatePost={handleCreatePost} />

          <div className="divide-y divide-purple-50">
            {posts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">🎊</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Feed vazio!</h3>
                <p className="text-gray-500 mb-6">Seja o primeiro a compartilhar algo.</p>
                <button
                  onClick={() => document.querySelector('textarea')?.focus()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Criar primeiro post
                </button>
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
          <div className="bg-white rounded-2xl p-5 sticky top-4 border border-purple-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">✨ Em Destaque</h3>
            <div className="space-y-1">
              {TRENDING.map(({ category, tag, sub, color }) => (
                <div key={tag} className={`hover:bg-gray-50 px-3 py-3 rounded-xl cursor-pointer transition-all border border-transparent ${borderHover[color]}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${dotColor[color]}`} />
                    <p className={`text-xs font-medium ${textColor[color]}`}>{category}</p>
                  </div>
                  <p className="text-gray-900 font-bold text-sm">{tag}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3">Quem seguir</h4>
              <div className="space-y-2">
                {users.length > 0 ? users.map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between hover:bg-gray-50 px-2 py-2 rounded-xl transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold">
                        {u.name?.[0]?.toUpperCase() || u.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">@{u.username}</p>
                        <p className="text-xs text-gray-400">{u.followers_count} seguidores</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(u.id)}
                      className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition font-medium"
                    >
                      Seguir
                    </button>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400 text-center py-2">Nenhum usuário encontrado</p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}