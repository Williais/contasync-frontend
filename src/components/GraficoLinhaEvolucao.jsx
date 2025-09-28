import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function GraficoLinhaEvolucao({ transacoes, categorias }) {
  
  const prepararDados = () => {
    // Filtra e ORDENA as despesas primeiro
    const despesasOrdenadas = transacoes
      .filter(t => t.tipo_transacao === 'despesa')
      .sort((a, b) => new Date(a.data_transacao) - new Date(b.data_transacao));
    
    // Agrupa os dados
    const dadosAgrupados = despesasOrdenadas.reduce((acc, despesa) => {
      const mesAno = new Date(despesa.data_transacao).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' });
      const categoria = categorias.find(c => c.id === despesa.categoria_id)?.nome || 'Sem Categoria';
      const valor = parseFloat(despesa.valor);
      
      if (!acc[mesAno]) acc[mesAno] = {};
      acc[mesAno][categoria] = (acc[mesAno][categoria] || 0) + valor;
      return acc;
    }, {});

    const labels = Object.keys(dadosAgrupados); // Agora que agrupamos a partir de uma lista ordenada, as chaves estarão na ordem correta.
    const todasCategorias = [...new Set(despesasOrdenadas.map(d => categorias.find(c => c.id === d.categoria_id)?.nome || 'Sem Categoria'))];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    const datasets = todasCategorias.map((categoria, index) => ({
      label: categoria,
      data: labels.map(label => dadosAgrupados[label][categoria] || 0),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '80',
      fill: false,
      tension: 0.1,
    }));
    
    return { labels, datasets };
  };

  const chartData = prepararDados();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <Box sx={{ height: '300px', position: 'relative' }}>
      <Line options={options} data={chartData} />
    </Box>
  );
}

export default GraficoLinhaEvolucao;