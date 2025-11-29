import { Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import Feed from "./components/Feed";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Componente para rotas protegidas
function AppRoutes() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          user ? <Navigate to="/feed" replace /> : <LoginScreen />
        } 
      />
      <Route 
        path="/feed" 
        element={
          user ? <Feed currentUser={user} onLogout={logout} /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/feed" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}