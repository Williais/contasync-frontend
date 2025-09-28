// src/pages/CategoriasPage.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { Box, Typography, List, ListItem, ListItemText, Paper, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import FormularioCategoria from '../components/FormularioCategoria';
import FormularioEditarCategoria from '../components/FormularioEditarCategoria';
import ConfirmationDialog from '../components/ConfirmationDialog';


function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const { usuario, loading } = useContext(UserContext);
  const { showNotification } = useNotification();
  

  // Estados para os modais
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [dialogExclusao, setDialogExclusao] = useState({ open: false, id: null });

  // Busca as categorias iniciais
  useEffect(() => {
    if (usuario) {
      const buscarCategorias = async () => {
        try {
          const res = await axios.get('http://localhost:3000/categorias');
          setCategorias(res.data);
        } catch (error) {
          console.error('Erro ao buscar categorias:', error);
          showNotification('Erro ao buscar categorias.', 'error');
        }
      };
      buscarCategorias();
    }
  }, [usuario, showNotification]);

  // Handlers para os formulários
  const handleCategoriaAdicionada = (novaCategoria) => {
    setCategorias(categoriasAtuais => [...categoriasAtuais, novaCategoria]);
  };

  

  const handleEdicaoConcluida = (categoriaAtualizada) => {
    setCategorias(categoriasAtuais => 
      categoriasAtuais.map(cat => 
        cat.id === categoriaAtualizada.id ? categoriaAtualizada : cat
      )
    );
    handleFecharModalEdicao();
  };

  // Handlers para o modal de edição
  const handleAbrirModalEdicao = (categoria) => {
    setCategoriaSelecionada(categoria);
    setModalEdicaoAberto(true);
  };

  const handleFecharModalEdicao = () => {
    setModalEdicaoAberto(false);
    setCategoriaSelecionada(null);
  };

  // Handlers para o diálogo de exclusão
  const handleAbrirDialogoExclusao = (id) => {
    setDialogExclusao({ open: true, id: id });
  };

  const handleFecharDialogoExclusao = () => {
    setDialogExclusao({ open: false, id: null });
  };

  const handleConfirmarExclusao = async () => {
    const idParaDeletar = dialogExclusao.id;
    try {
      await axios.delete(`http://localhost:3000/categorias/${idParaDeletar}`);
      setCategorias(categoriasAtuais => categoriasAtuais.filter(c => c.id !== idParaDeletar));
      showNotification('Categoria excluída com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      showNotification('Não foi possível excluir a categoria.', 'error');
    } finally {
      handleFecharDialogoExclusao();
    }
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
      <Typography variant="h4" component="h1" gutterBottom>
        Gerenciar Categorias
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 4, maxWidth: '600px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Adicionar Nova Categoria
        </Typography>
        <FormularioCategoria onCategoriaAdicionada={handleCategoriaAdicionada} />
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Categorias Existentes
        </Typography>
        <List>
          {categorias.map(cat => (
            <ListItem 
              key={cat.id} 
              divider
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleAbrirModalEdicao(cat)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleAbrirDialogoExclusao(cat.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText 
                primary={cat.nome} 
                secondary={cat.tipo.charAt(0).toUpperCase() + cat.tipo.slice(1)} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      
      <Dialog open={modalEdicaoAberto} onClose={handleFecharModalEdicao} fullWidth maxWidth="sm">
        <DialogTitle>
          Editar Categoria
          <IconButton onClick={handleFecharModalEdicao} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <FormularioEditarCategoria categoriaParaEditar={categoriaSelecionada} onEdicaoConcluida={handleEdicaoConcluida} />
        </DialogContent>
      </Dialog>
      
      <ConfirmationDialog
        open={dialogExclusao.open}
        onClose={handleFecharDialogoExclusao}
        onConfirm={handleConfirmarExclusao}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta categoria? As transações associadas a ela ficarão sem categoria."
      />
    </Box>
  );
}

export default CategoriasPage;