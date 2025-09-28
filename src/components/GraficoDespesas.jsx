import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Typography } from '@mui/material';

// É necessário registrar os componentes do Chart.js que vamos usar
ChartJS.register(ArcElement, Tooltip, Legend);

// O componente recebe a lista de transações e de categorias como props
function GraficoDespesas({ transacoes, categorias }) {

  // --- A MÁGICA: PREPARAÇÃO DOS DADOS ---
  // O Chart.js precisa dos dados em um formato específico.
  // Esta lógica pega nossas transações e as transforma nesse formato.
  const prepararDadosParaGrafico = () => {
    const despesas = transacoes.filter(t => t.tipo_transacao === 'despesa');

    // Se não houver despesas, retorna dados vazios para não dar erro
    if (despesas.length === 0) {
      return {
        labels: ['Nenhuma despesa registrada'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e0e0e0'], // Cor cinza para o estado vazio
        }],
      };
    }

    // Agrupa os valores por categoria_id
    const gastosPorCategoria = despesas.reduce((acc, despesa) => {
      const valor = parseFloat(despesa.valor);
      acc[despesa.categoria_id] = (acc[despesa.categoria_id] || 0) + valor;
      return acc;
    }, {});

    // Prepara os arrays de labels (nomes) e data (valores)
    const labels = Object.keys(gastosPorCategoria).map(catId => {
      const categoriaEncontrada = categorias.find(c => c.id === parseInt(catId));
      return categoriaEncontrada ? categoriaEncontrada.nome : 'Sem Categoria';
    });

    const data = Object.values(gastosPorCategoria);

    return {
      labels,
      datasets: [
        {
          label: 'R$',
          data,
          backgroundColor: [ // Paleta de cores para o gráfico
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#C9CBCF', '#4D5360'
          ],
          hoverBackgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#C9CBCF', '#4D5360'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = prepararDadosParaGrafico();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right', // Posição da legenda
      },
    },
  };

  return (
    <Box sx={{ height: '300px', position: 'relative' }}>
      <Doughnut data={chartData} options={options} />
    </Box>
  );
}

export default GraficoDespesas;