import { Activity, Home, Search, Bell, Mail, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface SidebarProps {
  currentUser: any;
  onLogout: () => void;
}

export function Sidebar({ currentUser, onLogout }: SidebarProps) {
  return (
    <aside className="w-20 lg:w-64 p-4 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="bg-indigo-600 p-2 rounded-full">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <span className="hidden lg:block text-indigo-600">Pulse</span>
      </div>

      <nav className="flex-1 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-4 px-4">
          <Home className="w-6 h-6" />
          <span className="hidden lg:block">Início</span>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-4 px-4">
          <Search className="w-6 h-6" />
          <span className="hidden lg:block">Explorar</span>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-4 px-4">
          <Bell className="w-6 h-6" />
          <span className="hidden lg:block">Notificações</span>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-4 px-4">
          <Mail className="w-6 h-6" />
          <span className="hidden lg:block">Mensagens</span>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start gap-4 px-4">
          <User className="w-6 h-6" />
          <span className="hidden lg:block">Perfil</span>
        </Button>
      </nav>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <Avatar>
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-gray-900 truncate">{currentUser.name}</p>
            <p className="text-gray-600 text-sm truncate">@{currentUser.name.toLowerCase().replace(/\s+/g, '')}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-4 px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="w-6 h-6" />
          <span className="hidden lg:block">Sair</span>
        </Button>
      </div>
      
    <button 
      onClick={onLogout}
      className="w-full text-left p-3 hover:bg-gray-100 rounded-full text-red-600 font-medium"
    >
      Sair
    </button>
    </aside>
  );
}
