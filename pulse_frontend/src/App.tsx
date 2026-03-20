import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FestaCelebration } from './components/FestaCelebration';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Feed from './components/Feed';
import ProfileScreen from './components/ProfileScreen';
import { usersAPI } from './services/api';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      usersAPI.getMe()
        .then(userData => {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('user');
        });
    }
  }, []);

  const handleLogin = async (userData: any) => {
    try {
      const fullUser = await usersAPI.getMe();
      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
    } catch {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      const fullUser = await usersAPI.getMe();
      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
    } catch {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  };

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <BrowserRouter>
      {showCelebration && <FestaCelebration />}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/feed" /> : <LoginScreen onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/feed" /> : <RegisterScreen onRegister={handleRegister} />} />
          <Route path="/feed" element={user ? <Feed currentUser={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfileScreen currentUser={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}