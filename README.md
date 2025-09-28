# ContaSync - Interface do Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

## 📖 Sobre o Projeto

Este repositório contém o código do **frontend** da aplicação de gestão financeira **ContaSync**. Construída com React, esta interface oferece uma experiência de usuário moderna, interativa e totalmente responsiva para interagir com a [API do ContaSync Backend](https://github.com/Williais/ContaSync_Backend).

O foco principal foi criar um dashboard analítico e intuitivo, onde o usuário pode visualizar, cadastrar e gerenciar suas finanças pessoais de forma simples e visual, com todos os dados sendo atualizados em tempo real, sem a necessidade de recarregar a página.

---

## ✨ Funcionalidades Principais

- **Login Social com Google:** Integração com o backend para permitir uma autenticação segura e simplificada.
- **Dashboard Analítico:** Exibe um resumo financeiro com cards de Entradas, Saídas e Saldo, que são atualizados dinamicamente.
- **Visualização de Dados com Gráficos:** Utiliza a biblioteca Chart.js para renderizar múltiplos gráficos interativos:
  - **Gráfico de Pizza:** Mostra a distribuição de despesas por categoria.
  - **Gráfico de Barras:** Compara o total de proventos vs. despesas de cada mês.
  - **Gráfico de Linha:** Exibe a evolução dos gastos em cada categoria ao longo do tempo.
- **Gerenciamento Completo (CRUD):** Interface completa com modais e diálogos de confirmação para criar, ler, atualizar e deletar transações e categorias.
- **Filtragem Dinâmica:** Permite ao usuário filtrar todo o dashboard por mês e ano, atualizando todos os componentes visuais de acordo com o período selecionado.
- **Design Responsivo:** Construído com Material-UI, o layout se adapta a qualquer tamanho de tela, de monitores grandes a celulares, com uma navbar lateral que se transforma em menu hambúrguer.
- **Sistema de Notificações:** Utiliza um sistema de "Snackbar" para fornecer feedback visual para o usuário sobre o sucesso ou falha de suas ações (ex: "Transação criada com sucesso!").
- **Gerenciamento de Estado Global:** Utiliza a Context API do React para gerenciar o estado de autenticação do usuário e outros dados globais, garantindo que a informação esteja sempre sincronizada entre os componentes.

---

## 🛠️ Tecnologias e Bibliotecas

| Categoria                | Tecnologia / Biblioteca                                    |
| :----------------------- | :--------------------------------------------------------- |
| **Biblioteca Principal** | [React](https://react.dev/)                                |
| **Build Tool**           | [Vite](https://vitejs.dev/)                                |
| **Componentes de UI**    | [Material-UI (MUI)](https://mui.com/)                      |
| **Gráficos**             | [Chart.js](https://www.chartjs.org/) com `react-chartjs-2` |
| **Requisições HTTP**     | [Axios](https://axios-http.com/)                           |
| **Roteamento**           | [React Router](https://reactrouter.com/)                   |

---

## 🔮 Funcionalidades Futuras Planejadas

- [ ] **Navbar Responsiva:** Implementar a lógica para a navbar se transformar em um menu "hambúrguer" em telas menores.
- [ ] **Detalhes nos Cards:** Adicionar informações de maior/menor despesa e provento nos cards de resumo.
- [ ] **Configurações do Usuário:** Criar uma página onde o usuário possa gerenciar suas preferências.
- [ ] **Integração com Google Calendar/Push API:** Construir a interface para que o usuário possa autorizar e gerenciar os lembretes de vencimento.

---

## ⚙️ Como Executar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Williais/contasync-frontend.git](https://github.com/Williais/contasync-frontend.git)
    ```
2.  **Navegue para a pasta do projeto:**
    ```bash
    cd contasync-frontend
    ```
3.  **Instale as dependências:**
    - Usando NPM:
      ```bash
      npm install
      ```
    - Ou usando Yarn:
      ```bash
      yarn
      ```
4.  **Verifique o Backend:**

    - Certifique-se de que o [servidor do backend](https://github.com/Williais/ContaSync_Backend) esteja rodando, pois o frontend precisa da API para funcionar. O backend geralmente roda em `http://localhost:3000`.

5.  **Inicie o servidor de desenvolvimento:**
    - Usando NPM:
      ```bash
      npm run dev
      ```
    - Ou usando Yarn:
      ```bash
      yarn dev
      ```
      A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).
