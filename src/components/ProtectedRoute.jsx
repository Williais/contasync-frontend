import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Box, CircularProgress, Typography } from '@mui/material';

// Este componente "envolve" as páginas que precisam de proteção
function ProtectedRoute({ children }) {
  const { usuario, loading } = useUser();

  // 1. Se o contexto ainda está verificando o usuário, mostra uma tela de carregamento
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography ml={2}>Verificando autenticação...</Typography>
      </Box>
    );
  }

  // 2. Se o carregamento terminou e NÃO HÁ usuário, redireciona para a página de login
  if (!usuario) {
    // O componente Navigate do React Router faz o redirecionamento
    return <Navigate to="/login" replace />;
  }

  // 3. Se o carregamento terminou e HÁ um usuário, mostra a página solicitada
  return children;
}

export default ProtectedRoute;