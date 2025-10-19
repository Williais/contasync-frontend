# ContaSync - Interface do Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 📖 Sobre o Projeto

Este repositório contém o código do **frontend** da aplicação de gestão financeira **ContaSync**. Construída com React, esta interface oferece uma experiência de usuário moderna, interativa e totalmente responsiva, conectando-se diretamente ao **Supabase** para gerenciamento de dados e autenticação.

O foco principal foi criar um dashboard analítico e intuitivo, onde o usuário pode visualizar, cadastrar e gerenciar suas finanças pessoais de forma simples e visual, com todos os dados sendo atualizados em tempo real, sem a necessidade de recarregar a página.

---

## ✨ Funcionalidades Principais

* **Login Social com Google:** Integração segura e simplificada gerenciada pelo Supabase Auth.
* **Dashboard Analítico:** Exibe um resumo financeiro (Entradas, Saídas, Saldo) e gráficos detalhados que são atualizados dinamicamente.
* **Visualização de Dados com Gráficos:** Utiliza Chart.js para renderizar:
    * **Gráfico de Pizza:** Distribuição de despesas por categoria.
    * **Gráfico de Barras:** Comparativo mensal de proventos vs. despesas.
    * **Gráfico de Linha:** Evolução dos gastos por categoria ao longo do tempo.
* **Gerenciamento Completo (CRUD):** Interface com modais e diálogos para criar, ler, atualizar e deletar transações, categorias e lembretes de pagamento.
* **Filtragem Dinâmica:** Permite ao usuário filtrar o dashboard por mês e ano.
* **Design Responsivo:** Construído com Material-UI, com layout adaptável e navbar lateral responsiva (menu hambúrguer).
* **Sistema de Notificações:** Feedback visual (Snackbar) para ações do usuário.
* **Gerenciamento de Estado Global:** Context API do React para gerenciar estado de autenticação e dados compartilhados.
* **Segurança a Nível de Linha (RLS):** Garante que cada usuário acesse apenas seus próprios dados, configurado diretamente no Supabase.

---

## 🛠️ Tecnologias e Bibliotecas

| Categoria             | Tecnologia / Biblioteca             |
| :---------------------- | :---------------------------------- |
| **Biblioteca Principal**| [React](https://react.dev/)         |
| **Build Tool** | [Vite](https://vitejs.dev/)         |
| **Componentes de UI** | [Material-UI (MUI)](https://mui.com/)|
| **Gráficos** | [Chart.js](https://www.chartjs.org/) com `react-chartjs-2` |
| **Backend & DB** | [Supabase](https://supabase.com/)   |
| **Cliente Supabase** | `@supabase/supabase-js`             |
| **Roteamento** | [React Router](https://reactrouter.com/) |

---

## 🔮 Funcionalidades Futuras Planejadas

- [ ] **Sistema de Lembretes (Backend):** Implementar a Supabase Edge Function agendada para verificar vencimentos.
- [ ] **Integração com Google Calendar:** Permitir que os lembretes criem eventos na agenda do usuário.
- [ ] **Notificações Push:** Enviar notificações via navegador para avisos de vencimento.
- [ ] **Detalhes nos Cards:** Adicionar informações de maior/menor despesa e provento nos cards de resumo (já implementado!).
- [ ] **Configurações do Usuário:** Criar uma página para gerenciar preferências.

---

## ⚙️ Como Executar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Williais/contasync-frontend.git](https://github.com/Williais/contasync-frontend.git)
    cd contasync-frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn
    ```
3.  **Crie um projeto no Supabase:**
    * Vá para [supabase.com](https://supabase.com), crie uma conta e um novo projeto.
    * Salve a **Project URL** e a **`anon` `public` API Key** (encontradas em Project Settings > API).

4.  **Configure as variáveis de ambiente:**
    * Na raiz do projeto, crie um arquivo chamado `.env`.
    * Adicione as seguintes variáveis com os valores do seu projeto Supabase:
        ```env
        VITE_SUPABASE_URL=SUA_URL_DO_PROJETO_SUPABASE
        VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA_DO_SUPABASE
        ```

5.  **Configure o banco de dados:**
    * No **SQL Editor** do seu projeto Supabase, execute o script SQL fornecido no projeto para criar as tabelas (`categorias`, `transacoes`, `lembretes`) e as políticas de segurança (RLS).

6.  **Configure a Autenticação Google:**
    * No Google Cloud Console, crie credenciais OAuth 2.0 (Client ID e Client Secret).
    * No Supabase (Authentication > Providers > Google), ative o provedor e insira as credenciais do Google.
    * Copie a **Callback URL** do Supabase e adicione-a aos "URIs de redirecionamento autorizados" no Google Cloud Console.
    * Adicione a URL do seu ambiente local (ex: `http://localhost:5173`) às "Origens JavaScript autorizadas" no Google Cloud Console.

7.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
    A aplicação estará disponível em `http://localhost:5173`.

---

## 👨‍💻 Autor

**Williais** * GitHub: [@Williais](https://github.com/Williais) ````
