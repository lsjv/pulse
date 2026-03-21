import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Camera, ArrowLeft } from 'lucide-react';
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
    } catch {
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
          <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-purple-100 px-6 py-4 z-10 flex items-center gap-4">
            <button onClick={() => navigate('/feed')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
              <ArrowLeft style={{ width: 20, height: 20 }} />
            </button>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Meu Perfil
              </h2>
              <p className="text-sm text-gray-400">Edite suas informações</p>
            </div>
          </div>

          <div style={{ maxWidth: 560, margin: '0 auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 24 }}>
              <div style={{ position: 'relative', width: 96, height: 96 }}>
                <div style={{
                  width: 96, height: 96, borderRadius: '50%',
                  border: '4px solid #d8b4fe', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>
                      {currentUser?.name?.[0]?.toUpperCase() || currentUser?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                    border: 'none', borderRadius: '50%', padding: 8,
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <Camera style={{ width: 16, height: 16, color: 'white' }} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              </div>
              <p style={{ fontSize: 14, color: '#9ca3af' }}>Clique na câmera para trocar a foto</p>
            </div>

            {/* Nome */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                style={{
                  width: '100%', border: '1px solid #e5e7eb', borderRadius: 12,
                  padding: '12px 16px', fontSize: 16, color: '#1f2937',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Username */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Username</label>
              <input
                type="text"
                value={currentUser?.username || ''}
                disabled
                style={{
                  width: '100%', border: '1px solid #f3f4f6', borderRadius: 12,
                  padding: '12px 16px', fontSize: 16, color: '#9ca3af',
                  background: '#f9fafb', cursor: 'not-allowed', boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>O username não pode ser alterado</p>
            </div>

            {/* Bio */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Conta um pouco sobre você..."
                maxLength={500}
                rows={4}
                style={{
                  width: '100%', border: '1px solid #e5e7eb', borderRadius: 12,
                  padding: '12px 16px', fontSize: 16, color: '#1f2937',
                  outline: 'none', resize: 'none', boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>{bio.length}/500</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', padding: '16px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>{currentUser?.posts_count || 0}</p>
                <p style={{ fontSize: 14, color: '#9ca3af' }}>Posts</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>{currentUser?.followers_count || 0}</p>
                <p style={{ fontSize: 14, color: '#9ca3af' }}>Seguidores</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>{currentUser?.following_count || 0}</p>
                <p style={{ fontSize: 14, color: '#9ca3af' }}>Seguindo</p>
              </div>
            </div>

            {/* Erro / Sucesso */}
            {error && (
              <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, color: '#dc2626', fontSize: 14, textAlign: 'center' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, color: '#16a34a', fontSize: 14, textAlign: 'center' }}>
                ✅ Perfil atualizado com sucesso!
              </div>
            )}

            {/* Botão salvar */}
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                color: 'white',
                fontWeight: 600,
                padding: '12px',
                borderRadius: 12,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: 16,
                marginBottom: 40,
              }}
            >
              {loading ? 'Salvando...' : '💾 Salvar perfil'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}