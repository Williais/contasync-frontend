// src/pages/LoginPage.jsx
import { supabase } from '../supabaseClient';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';

function LoginPage() {
  // Função que será chamada pelo botão
  const handleLogin = async () => {
    try {
      // A função do Supabase que cuida de todo o fluxo de login com o Google
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      console.error("Erro no login com Google:", error);
    }
  };
  return (
    // Box é como uma 'div' superpoderosa para layout.
    // 'display: flex', 'alignItems', etc., são propriedades (props) que controlam o CSS.
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      height="100vh" 
      bgcolor="#f5f5f5"
    >
      <Box textAlign="center" p={4} bgcolor="white" borderRadius={2} boxShadow={3}>
        {/* Typography é usado para todos os textos, com estilos pré-definidos */}
        <Typography variant="h4" component="h1" gutterBottom>
          ContaSync
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Seu gestor financeiro pessoal.
        </Typography>
        
        {/* O componente Button já vem com design e animações.
            'variant="contained"' dá o estilo de botão principal.
            'startIcon' coloca um ícone no início do botão.
        */}
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          startIcon={<GoogleIcon />}
          onClick={handleLogin} // Usamos 'href' para que ele funcione como um link
          sx={{ mt: 4 }} // 'sx' é uma prop para adicionar CSS customizado facilmente
        >
          Entrar com Google
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;