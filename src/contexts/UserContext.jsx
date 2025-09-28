import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  axios.defaults.withCredentials = true;

  // Função para buscar os dados (usuário e categorias)
  const fetchData = async () => {
    try {
      const resUser = await axios.get('http://localhost:3000/auth/user');
      setUsuario(resUser.data);
      
      // Se o usuário foi encontrado, busca as categorias
      const resCategorias = await axios.get('http://localhost:3000/categorias');
      setCategorias(resCategorias.data);

    } catch (error) {
      console.error("Sessão não encontrada ou erro ao buscar dados:", error.message);
      setUsuario(null); // Garante que o usuário seja nulo em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // O valor compartilhado inclui a função fetchData para que outros componentes possam recarregar os dados se necessário
  const value = { usuario, loading, categorias, setCategorias, fetchData };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook customizado para facilitar o uso
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser deve ser usado dentro de um UserProvider');
    }
    return context;
}