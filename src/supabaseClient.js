// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// A MÁGICA ESTÁ AQUI:
// 'import.meta.env.VITE_SUPABASE_URL' lê a variável de ambiente que configuramos no Netlify.
// O prefixo 'VITE_' é OBRIGATÓRIO para que o Vite exponha a variável para o nosso código.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se as variáveis de ambiente não forem encontradas, ele vai dar um erro claro no console.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram definidas.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);