import { Activity, Home, Search, Bell, Mail, User, LogOut, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface SidebarProps {
  currentUser: any;
  onLogout: () => void;
}

export function Sidebar({ currentUser, onLogout }: SidebarProps) {
  const user = currentUser || { name: 'Usuário', username: 'usuario', avatar: '' };

  const navItems = [
    { icon: Home, label: 'Início', hover: 'hover:bg-purple-100 hover:text-purple-600' },
    { icon: Search, label: 'Explorar', hover: 'hover:bg-pink-100 hover:text-pink-600' },
    { icon: Bell, label: 'Notificações', hover: 'hover:bg-yellow-100 hover:text-yellow-700' },
    { icon: Mail, label: 'Mensagens', hover: 'hover:bg-purple-100 hover:text-purple-600' },
    { icon: User, label: 'Perfil', hover: 'hover:bg-pink-100 hover:text-pink-600' },
  ];

  return (
    <aside className="w-20 lg:w-64 p-4 flex flex-col h-screen sticky top-0 border-r border-purple-100 bg-gradient-to-b from-white to-purple-50">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-full relative shadow-lg">
          <Activity className="w-6 h-6 text-white" />
          <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="hidden lg:block text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Pulse Festa
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ icon: Icon, label, hover }) => (
          <Button
            key={label}
            variant="ghost"
            className={`w-full justify-start gap-4 px-4 transition-all hover:scale-105 ${hover}`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block">{label}</span>
          </Button>
        ))}
      </nav>

      {/* Usuário e Logout */}
      <div className="border-t border-purple-200 pt-4 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 cursor-pointer transition-all">
          <Avatar className="border-2 border-purple-300 w-10 h-10 shrink-0">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-gray-900 truncate font-medium">{user.name}</p>
            <p className="text-purple-600 truncate text-sm">
              @{user.username || user.name?.toLowerCase()?.replace(/\s+/g, '')}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-4 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden lg:block">Sair</span>
        </Button>
      </div>
    </aside>
  );
}