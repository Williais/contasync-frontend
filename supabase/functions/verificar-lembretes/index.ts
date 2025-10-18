// supabase/functions/verificar-lembretes/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Função 'verificar-lembretes' foi chamada!")

Deno.serve(async (req) => {
  // Esta parte lida com uma requisição 'OPTIONS' que o navegador envia antes de um POST/GET,
  // para verificar as permissões de CORS. É um código padrão.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. CRIA UM CLIENTE SUPABASE AUTORIZADO
    //    Este cliente tem permissões de "administrador" para ler todos os dados,
    //    ignorando as regras de Row Level Security. É essencial para um robô que precisa ver os dados de todos.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. BUSCA OS LEMBRETES NO BANCO DE DADOS
    //    Por enquanto, vamos buscar TODOS os lembretes para testar.
    const { data: lembretes, error } = await supabaseAdmin
      .from('lembretes')
      .select('*')
      .eq('ativo', true); // Busca apenas os lembretes ativos

    if (error) {
      throw error
    }

    // 3. RETORNA OS DADOS ENCONTRADOS
    //    Isso nos permite testar a função e ver se ela está funcionando.
    return new Response(JSON.stringify({ lembretes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // Em caso de erro, retorna uma mensagem de erro.
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})