import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function GraficoBarrasGastosMensais({ transacoes }) {
  
  const prepararDados = () => {
    // 1. ORDENA AS TRANSAÇÕES PRIMEIRO (A CORREÇÃO DEFINITIVA)
    const transacoesOrdenadas = [...transacoes].sort((a, b) => new Date(a.data_transacao) - new Date(b.data_transacao));

    // 2. AGRUPA OS DADOS, agora que estão ordenados
    const dadosPorMes = transacoesOrdenadas.reduce((acc, transacao) => {
      const mesAno = new Date(transacao.data_transacao).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' });
      const valor = parseFloat(transacao.valor);

      if (!acc[mesAno]) {
        acc[mesAno] = { proventos: 0, despesas: 0 }; // Cria os dois "baldes" para o mês
      }

      if (transacao.tipo_transacao === 'provento') {
        acc[mesAno].proventos += valor;
      } else {
        acc[mesAno].despesas += valor;
      }
      
      return acc;
    }, {});

    // 3. EXTRAI OS DADOS PARA O GRÁFICO
    const labels = Object.keys(dadosPorMes);
    const dadosProventos = labels.map(mes => dadosPorMes[mes].proventos);
    const dadosDespesas = labels.map(mes => dadosPorMes[mes].despesas);

    return {
      labels,
      // 4. AGORA TEMOS DOIS DATASETS, um para cada barra
      datasets: [
        {
          label: 'Entradas (Proventos)',
          data: dadosProventos,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Saídas (Despesas)',
          data: dadosDespesas,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ],
    };
  };

  const chartData = prepararDados();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: { x: { stacked: false }, y: { stacked: false, beginAtZero: true } }
  };

  return (
    <Box sx={{ height: '300px', position: 'relative' }}>
      <Bar options={options} data={chartData} />
    </Box>
  );
}

export default GraficoBarrasGastosMensais;