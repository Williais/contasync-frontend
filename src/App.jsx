import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriasPage from './pages/CategoriasPage';
import LembretesPage from './pages/LembretesPage';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <UserProvider>
          <Routes>
            {/* A rota de Login continua pública */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Todas as outras rotas agora são protegidas pelo "porteiro" */}
            <Route 
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/categorias" element={<CategoriasPage />} />
                      <Route path="/lembretes" element={<LembretesPage />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </UserProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
export default App;