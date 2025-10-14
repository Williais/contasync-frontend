import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import FormularioLembrete from '../components/FormularioLembrete';
import FormularioEditarLembrete from '../components/FormularioEditarLembrete'; // 1. Importa o novo formulário
import ConfirmationDialog from '../components/ConfirmationDialog';

function LembretesPage() {
  const [lembretes, setLembretes] = useState([]);
  const { usuario, loading } = useUser();
  const { showNotification } = useNotification();

  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [lembreteSelecionado, setLembreteSelecionado] = useState(null);
  const [dialogExclusao, setDialogExclusao] = useState({ open: false, id: null });

  useEffect(() => {
    if (usuario) {
      const buscarLembretes = async () => {
        try {
          const { data, error } = await supabase.from('lembretes').select('*').order('dia_vencimento', { ascending: true });
          if (error) throw error;
          setLembretes(data);
        } catch (error) {
          showNotification('Erro ao buscar lembretes.', 'error');
        }
      };
      buscarLembretes();
    }
  }, [usuario, showNotification]);

  const handleLembreteAdicionado = (novoLembrete) => {
    setLembretes(atuais => [...atuais, novoLembrete].sort((a,b) => a.dia_vencimento - b.dia_vencimento));
  };
  
  const handleEdicaoConcluida = (lembreteAtualizado) => {
    setLembretes(l => l.map(lem => lem.id === lembreteAtualizado.id ? lembreteAtualizado : lem));
    setModalEdicaoAberto(false);
  };

  const handleConfirmarExclusao = async () => {
    const id = dialogExclusao.id;
    try {
      const { error } = await supabase.from('lembretes').delete().eq('id', id);
      if (error) throw error;
      setLembretes(l => l.filter(lem => lem.id !== id));
      showNotification('Lembrete excluído com sucesso!', 'success');
    } catch (error) {
      showNotification(`Não foi possível excluir o lembrete: ${error.message}`, 'error');
    } finally {
      setDialogExclusao({ open: false, id: null });
    }
  };
  
  const handleAbrirModalEdicao = (lembrete) => {
    setLembreteSelecionado(lembrete);
    setModalEdicaoAberto(true);
  };

  if (loading) { return <CircularProgress />; }

  const formatarData = (data) => data ? new Date(data).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A';

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>Gerenciar Lembretes de Pagamento</Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 4, maxWidth: '700px' }}>
        <Typography variant="h5" component="h2" gutterBottom>Adicionar Novo Lembrete</Typography>
        <FormularioLembrete onLembreteAdicionado={handleLembreteAdicionado} />
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>Seus Lembretes</Typography>
        <List>
          {lembretes.map(lembrete => (
            <ListItem key={lembrete.id} divider
              secondaryAction={
                <>
                  <IconButton onClick={() => handleAbrirModalEdicao(lembrete)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setDialogExclusao({ open: true, id: lembrete.id })}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }>
              <ListItemText 
                primary={`${lembrete.descricao} - R$ ${lembrete.valor_estimado || 'N/A'}`}
                secondary={
                  lembrete.tipo === 'fixo'
                  ? `Fixo - Vence todo dia ${lembrete.dia_vencimento}`
                  : `Temporário - Vence dia ${lembrete.dia_vencimento} (de ${formatarData(lembrete.data_inicio)} a ${formatarData(lembrete.data_final)})`
                } 
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <ConfirmationDialog
        open={dialogExclusao.open}
        onClose={() => setDialogExclusao({ open: false, id: null })}
        onConfirm={handleConfirmarExclusao}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este lembrete?"
      />

      <Dialog open={modalEdicaoAberto} onClose={() => setModalEdicaoAberto(false)} fullWidth maxWidth="md">
        <DialogTitle>
            Editar Lembrete
            <IconButton onClick={() => setModalEdicaoAberto(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent>
            {/* 2. Substitui o placeholder pelo formulário real */}
            <FormularioEditarLembrete lembreteParaEditar={lembreteSelecionado} onEdicaoConcluida={handleEdicaoConcluida} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
export default LembretesPage;