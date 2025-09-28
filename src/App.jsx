import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriasPage from './pages/CategoriasPage';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rota "coringa" que aplica o Layout a todas as páginas internas */}
            <Route 
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/categorias" element={<CategoriasPage />} />
                    {/* Futuras rotas protegidas podem ser adicionadas aqui */}
                  </Routes>
                </Layout>
              } 
            />
          </Routes>
        </UserProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;