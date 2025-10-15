import { useState, useEffect, useMemo, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { UserContext, useUser } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
    Box, Typography, List, ListItem, ListItemText, Paper, Fab, Dialog, 
    DialogTitle, DialogContent, IconButton, Grid, CircularProgress, 
    FormControl, InputLabel, Select, MenuItem, Button, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import FormularioTransacao from '../components/FormularioTransacao';
import FormularioEditarTransacao from '../components/FormularioEditarTransacao';
import ResumoCard from '../components/ResumoCard';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import GraficoDespesas from '../components/GraficoDespesas';
import GraficoBarrasGastosMensais from '../components/GraficoBarrasGastosMensais';
import GraficoLinhaEvolucao from '../components/GraficoLinhaEvolucao';



function DashboardPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [modalCriacaoAberto, setModalCriacaoAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
  const [dialogExclusao, setDialogExclusao] = useState({ open: false, id: null });

  const [anoFiltro, setAnoFiltro] = useState(null);
  const [mesFiltro, setMesFiltro] = useState(null);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);

  const { usuario, loading, categorias } = useUser();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) {
      const buscarTransacoes = async () => {
        let query = supabase.from('transacoes').select('*');

        // Lógica de filtro com Supabase
        if (anoFiltro && mesFiltro) {
          const primeiroDia = `${anoFiltro}-${String(mesFiltro).padStart(2, '0')}-01`;
          const ultimoDia = new Date(anoFiltro, mesFiltro, 0).toISOString().split('T')[0];
          query = query.gte('data_transacao', primeiroDia).lte('data_transacao', ultimoDia);
        }
        
        query = query.order('data_transacao', { ascending: false });

        const { data, error } = await query;
        
        if (error) {
          showNotification('Erro ao carregar transações.', 'error');
          console.error("Erro do Supabase:", error);
        } else {
          setTransacoes(data);
        }
      };
      buscarTransacoes();
    }
  }, [usuario, anoFiltro, mesFiltro, showNotification]);

  const handleAplicarFiltro = () => {
    setAnoFiltro(anoSelecionado);
    setMesFiltro(mesSelecionado);
  };

  const handleLimparFiltro = () => {
    setAnoFiltro(null); // Limpa o filtro para buscar tudo
    setMesFiltro(null);
  };
  
  // --- LÓGICA DE EXCLUSÃO ATUALIZADA PARA SUPABASE ---
  const handleConfirmarExclusao = async () => {
    const idParaDeletar = dialogExclusao.id;
    try {
      const { error } = await supabase.from('transacoes').delete().eq('id', idParaDeletar);
      if (error) throw error;

      setTransacoes(transacoesAtuais => transacoesAtuais.filter(t => t.id !== idParaDeletar));
      showNotification('Transação excluída com sucesso!', 'success');
    } catch (error) {
      showNotification(`Não foi possível excluir a transação: ${error.message}`, 'error');
    } finally {
      setDialogExclusao({ open: false, id: null });
    }
  };

  const handleTransacaoAdicionada = (novaTransacao) => {
    setTransacoes(transacoesAtuais => [novaTransacao, ...transacoesAtuais]);
    setModalCriacaoAberto(false);
  };

  const handleEdicaoConcluida = (transacaoAtualizada) => {
    setTransacoes(transacoesAtuais => 
      transacoesAtuais.map(trans => 
        trans.id === transacaoAtualizada.id ? transacaoAtualizada : trans
      )
    );
    setModalEdicaoAberto(false);
  };

  
  const resumoFinanceiro = useMemo(() => {
    const resumoInicial = { entradas: 0, saidas: 0, maiorEntrada: { descricao: '-', valor: 0 }, maiorSaida: { descricao: '-', valor: 0 } };
    const resumo = transacoes.reduce((acc, transacao) => {
        const valor = parseFloat(transacao.valor);
        if (transacao.tipo_transacao === 'provento') {
            acc.entradas += valor;
            if (valor > acc.maiorEntrada.valor) { acc.maiorEntrada = { descricao: transacao.descricao, valor: valor }; }
        } else if (transacao.tipo_transacao === 'despesa') {
            acc.saidas += valor;
            if (valor > acc.maiorSaida.valor) { acc.maiorSaida = { descricao: transacao.descricao, valor: valor }; }
        }
        return acc;
    }, resumoInicial);
    const saldo = resumo.entradas - resumo.saidas;
    return { ...resumo, saldo };
  }, [transacoes]);

  const formatarData = (data) => {
    if (!data) return '';
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) { return 'Data inválida'; }
    return dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };


  const anosDisponiveis = [2025, 2026, 2027, 2028, 2029];

  const mesesDisponiveis = [
    { valor: 1, nome: 'Janeiro' }, { valor: 2, nome: 'Fevereiro' }, { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' }, { valor: 5, nome: 'Maio' }, { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' }, { valor: 8, nome: 'Agosto' }, { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' }, { valor: 11, nome: 'Novembro' }, { valor: 12, nome: 'Dezembro' }
  ];

  // --- RENDERIZAÇÃO ---
  if (loading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
            <Typography ml={2}>Carregando...</Typography>
        </Box>
    );
}
  
  return (
    <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard de {usuario?.nome}
            </Typography>
        </Box>
        
        {/* --- 1. SEÇÃO DE CARDS DE RESUMO --- */}
        <Grid container spacing={3} mt={2} justifyContent="center">
    <Grid item xs={12} md={4}>
        {/* Passa a maiorEntrada como 'detalhe' para o card de Entradas */}
        <ResumoCard 
            titulo="Entradas" 
            valor={resumoFinanceiro.entradas} 
            cor="#4caf50" 
            detalhe={resumoFinanceiro.maiorEntrada} 
        />
    </Grid>
    <Grid item xs={12} md={4}>
        {/* Passa a maiorSaida como 'detalhe' para o card de Saídas */}
        <ResumoCard 
            titulo="Saídas" 
            valor={resumoFinanceiro.saidas} 
            cor="#f44336" 
            detalhe={resumoFinanceiro.maiorSaida} 
        />
    </Grid>
    <Grid item xs={12} md={4}>
        {/* O card de Saldo não tem detalhe, então não passamos a prop */}
        <ResumoCard 
            titulo="Saldo" 
            valor={resumoFinanceiro.saldo} 
            cor={resumoFinanceiro.saldo >= 0 ? '#2196f3' : '#f44336'} 
        />
    </Grid>
</Grid>
        
        {/* --- 2. SEÇÃO DE GRÁFICOS --- */}
        <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2, textAlign: 'center' }}>
          Análise Visual
        </Typography>
        <Grid container spacing={3} justifyContent="center">
            {/* Coluna do Gráfico de Pizza */}
            <Grid item xs={12} md={6} lg={4}>
                <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom align="center">Despesas por Categoria</Typography>
                    <GraficoDespesas transacoes={transacoes} categorias={categorias} />
                </Paper>
            </Grid>

            {/* Coluna do Gráfico de Barras */}
            <Grid item xs={12} md={6} lg={8}>
                <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom align="center">Entradas vs. Saídas por Mês</Typography>
                    <GraficoBarrasGastosMensais transacoes={transacoes} />
                </Paper>
            </Grid>

            {/* Coluna do Gráfico de Linha */}
            <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom align="center">Evolução de Gastos por Categoria</Typography>
                    <GraficoLinhaEvolucao transacoes={transacoes} categorias={categorias} />
                </Paper>
            </Grid>
        </Grid>

        {/* --- 3. SEÇÃO DE TRANSAÇÕES RECENTES (ABAIXO E FULL-WIDTH) --- */}
        <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Suas Transações Recentes
            </Typography>

            <Box display="flex" gap={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Mês</InputLabel>
                        <Select value={mesSelecionado} label="Mês" onChange={(e) => setMesSelecionado(e.target.value)}>
                            {mesesDisponiveis.map(mes => <MenuItem key={mes.valor} value={mes.valor}>{mes.nome}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Ano</InputLabel>
                        <Select value={anoSelecionado} label="Ano" onChange={(e) => setAnoSelecionado(e.target.value)}>
                            {anosDisponiveis.map(ano => <MenuItem key={ano} value={ano}>{ano}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleAplicarFiltro}>Filtrar</Button>
                    <IconButton onClick={handleLimparFiltro} title="Limpar Filtro"><FilterListOffIcon /></IconButton>
                </Box>
            <Divider sx={{ my: 2 }} />
            <List>
                {transacoes.map(trans => (
                    <ListItem 
                        key={trans.id} 
                        divider
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="edit" onClick={() => { setTransacaoSelecionada(trans); setModalEdicaoAberto(true); }}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => setDialogExclusao({ open: true, id: trans.id })}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }
                    >
                        <ListItemText 
                            primary={trans.descricao} 
                            secondary={`R$ ${trans.valor} - ${formatarData(trans.data_transacao)}`} 
                        />
                        <Typography 
                            mr={5}
                            variant="body2" 
                            color={trans.tipo_transacao === 'provento' ? 'green' : 'red'}
                        >
                            {trans.tipo_transacao}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Paper>

        {/* --- Botão Flutuante e Modais (sem alteração de posição) --- */}
        <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={() => setModalCriacaoAberto(true)}>
            <AddIcon />
        </Fab>

        <Dialog open={modalCriacaoAberto} onClose={() => setModalCriacaoAberto(false)} fullWidth maxWidth="sm">
            <DialogTitle>Adicionar Nova Transação<IconButton onClick={() => setModalCriacaoAberto(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
            <DialogContent><FormularioTransacao onTransacaoAdicionada={handleTransacaoAdicionada} categorias={categorias} /></DialogContent>
        </Dialog>
        
        <Dialog open={modalEdicaoAberto} onClose={() => setModalEdicaoAberto(false)} fullWidth maxWidth="sm">
            <DialogTitle>Editar Transação<IconButton onClick={() => setModalEdicaoAberto(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
            <DialogContent><FormularioEditarTransacao transacaoParaEditar={transacaoSelecionada} onEdicaoConcluida={handleEdicaoConcluida} categorias={categorias} /></DialogContent>
        </Dialog>

        <ConfirmationDialog 
            open={dialogExclusao.open} 
            onClose={() => setDialogExclusao({ open: false, id: null })} 
            onConfirm={handleConfirmarExclusao} 
            title="Confirmar Exclusão" 
            message="Tem certeza que deseja excluir esta transação?"
        />
    </Box>
  );
}

export default DashboardPage;