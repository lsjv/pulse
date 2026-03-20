import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Camera, Save, ArrowLeft } from 'lucide-react';
import { usersAPI } from '../services/api';

interface ProfileScreenProps {
  currentUser: any;
  onLogout: () => void;
  onUpdateUser: (user: any) => void;
}

export default function ProfileScreen({ currentUser, onLogout, onUpdateUser }: ProfileScreenProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser?.first_name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('first_name', name);
      formData.append('bio', bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      const updatedUser = await usersAPI.updateMe(formData);
      onUpdateUser(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError('Erro ao salvar perfil. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex max-w-7xl mx-auto">
        <Sidebar currentUser={currentUser} onLogout={onLogout} onUpdateUser={onUpdateUser} />

        <main className="flex-1 border-x border-purple-100 bg-white/80 backdrop-blur-sm min-h-screen">
          {/* Header */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-purple-100 px-6 py-4 z-10 flex items-center gap-4">
            <button onClick={() => navigate('/feed')} className="text-gray-500 hover:text-purple-600 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Meu Perfil
              </h2>
              <p className="text-sm text-gray-400">Edite suas informações</p>
            </div>
          </div>

          <div className="max-w-xl mx-auto p-6 space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-purple-300 shadow-lg">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl">
                    {currentUser?.name?.[0]?.toUpperCase() || currentUser?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full shadow-lg hover:opacity-90 transition"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-sm text-gray-400">Clique na câmera para trocar a foto</p>
            </div>

            {/* Campos */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition text-gray-800"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Username</label>
                <input
                  type="text"
                  value={currentUser?.username || ''}
                  disabled
                  className="w-full border border-gray-100 rounded-xl px-4 py-3 bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">O username não pode ser alterado</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conta um pouco sobre você..."
                  maxLength={500}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition text-gray-800 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/500</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 justify-center py-4 border-y border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{currentUser?.posts_count || 0}</p>
                <p className="text-sm text-gray-400">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{currentUser?.followers_count || 0}</p>
                <p className="text-sm text-gray-400">Seguidores</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{currentUser?.following_count || 0}</p>
                <p className="text-sm text-gray-400">Seguindo</p>
              </div>
            </div>

            {/* Erro / Sucesso */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm text-center">
                ✅ Perfil atualizado com sucesso!
              </div>
            )}

            {/* Botão salvar */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar perfil
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}