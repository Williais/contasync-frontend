import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Completa o fluxo PKCE se houver ?code=... na URL
        await supabase.auth.exchangeCodeForSession(window.location.href);
      } catch (e) {
        // Se não for PKCE ou já estiver tratado, ignora
        console.warn('exchangeCodeForSession:', e?.message ?? e);
      } finally {
        navigate('/', { replace: true }); // vá para o dashboard
      }
    })();
  }, [navigate]);

  return null; // ou um spinner
}
