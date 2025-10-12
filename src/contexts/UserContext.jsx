import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import axios from 'axios'; // Mantenha o axios para chamadas de dados

// Configuração global do axios (se você moveu para um arquivo api/axios.js, melhor ainda)
axios.defaults.withCredentials = true; 

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Verificação inicial da sessão já existente
    const getInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUsuario(session?.user ?? null);
        setLoading(false);
    };
    getInitialSession();

    // Ouvinte para futuras mudanças (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('EVENTO DE AUTENTICAÇÃO DO SUPABASE:', event); // <-- NOSSO DETETIVE
        console.log('SESSÃO RECEBIDA:', session); // <-- NOSSO DETETIVE

        const user = session?.user ?? null;
        setUsuario(user);

        // Se o evento for SIGNED_IN, o loading já deve estar como falso.
        if(event === "SIGNED_IN"){
            setLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Efeito separado para buscar categorias quando o usuário muda
  useEffect(() => {
    if(usuario) {
        supabase.from('categorias').select('*')
            .then(({ data, error }) => {
                if(error) console.error(error);
                else setCategorias(data);
            });
    }
  }, [usuario]);


  const value = { usuario, loading, categorias, setCategorias };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) { throw new Error('useUser deve ser usado dentro de um UserProvider'); }
    return context;
}