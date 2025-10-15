import { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import FormularioCategoria from '../components/FormularioCategoria';
import FormularioEditarCategoria from '../components/FormularioEditarCategoria';
import ConfirmationDialog from '../components/ConfirmationDialog';


function CategoriasPage() {
  const { usuario, loading, categorias, setCategorias } = useUser();
  const { showNotification } = useNotification();

  
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [dialogExclusao, setDialogExclusao] = useState({ open: false, id: null });


  const handleCategoriaAdicionada = (novaCategoria) => {
    setCategorias(categoriasAtuais => [...categoriasAtuais, novaCategoria].sort((a, b) => a.nome.localeCompare(b.nome)));
  };

  const handleEdicaoConcluida = (catAtualizada) => {
    setCategorias(catsAtuais => catsAtuais.map(c => c.id === catAtualizada.id ? catAtualizada : c));
    setModalEdicaoAberto(false);
  };

  const handleConfirmarExclusao = async () => {
    const idParaDeletar = dialogExclusao.id;
    try {
      const { error } = await supabase.from('categorias').delete().eq('id', idParaDeletar);
      if (error) throw error;
      setCategorias(catsAtuais => catsAtuais.filter(c => c.id !== idParaDeletar));
      showNotification('Categoria excluída com sucesso!', 'success');
    } catch (error) {
      showNotification(`Não foi possível excluir a categoria: ${error.message}`, 'error');
    } finally {
      setDialogExclusao({ open: false, id: null });
    }
  };
  
  const handleAbrirModalEdicao = (categoria) => {
    setCategoriaSelecionada(categoria);
    setModalEdicaoAberto(true);
  };
  const handleFecharModalEdicao = () => {
    setModalEdicaoAberto(false);
    setCategoriaSelecionada(null);
  };
  const handleAbrirDialogoExclusao = (id) => {
    setDialogExclusao({ open: true, id: id });
  };
  const handleFecharDialogoExclusao = () => {
    setDialogExclusao({ open: false, id: null });
  };


  if (loading) { 
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress /> <Typography ml={2}>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>Gerenciar Categorias</Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 4, maxWidth: '600px' }}>
        <Typography variant="h5" component="h2" gutterBottom>Adicionar Nova Categoria</Typography>
        <FormularioCategoria onCategoriaAdicionada={handleCategoriaAdicionada} />
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>Categorias Existentes</Typography>
        <List>
          {categorias.map(cat => (
            <ListItem key={cat.id} divider
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleAbrirModalEdicao(cat)}><EditIcon /></IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleAbrirDialogoExclusao(cat.id)}><DeleteIcon /></IconButton>
                </>
              }>
              <ListItemText primary={cat.nome} secondary={cat.tipo.charAt(0).toUpperCase() + cat.tipo.slice(1)} />
            </ListItem>
          ))}
        </List>
      </Paper>
      
      <Dialog open={modalEdicaoAberto} onClose={handleFecharModalEdicao} fullWidth maxWidth="sm">
        <DialogTitle>Editar Categoria<IconButton onClick={handleFecharModalEdicao} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent><FormularioEditarCategoria categoriaParaEditar={categoriaSelecionada} onEdicaoConcluida={handleEdicaoConcluida} /></DialogContent>
      </Dialog>
      
      <ConfirmationDialog open={dialogExclusao.open} onClose={handleFecharDialogoExclusao} onConfirm={handleConfirmarExclusao} title="Confirmar Exclusão" message="Tem certeza?" />
    </Box>
  );
}

export default CategoriasPage;