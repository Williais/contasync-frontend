// src/components/FormularioEditarCategoria.jsx
import { useState, useEffect } from 'react';
import axios from '../api/axios.js'
import { Button, TextField, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext'; // 1. Importa o hook

function FormularioEditarCategoria({ categoriaParaEditar, onEdicaoConcluida }) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const { showNotification } = useNotification(); // 2. Pega a função de notificação

  useEffect(() => {
    if (categoriaParaEditar) {
      setNome(categoriaParaEditar.nome);
      setTipo(categoriaParaEditar.tipo);
    }
  }, [categoriaParaEditar]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/categorias/${categoriaParaEditar.id}`, {
        nome: nome,
        tipo: tipo,
      });
      
      // 3. Substitui o alert() pelo showNotification()
      showNotification('Categoria atualizada com sucesso!', 'success');
      onEdicaoConcluida(response.data);

    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      // 3. Substitui o alert() pelo showNotification()
      showNotification('Não foi possível atualizar a categoria.', 'error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <TextField
        label="Nome da Categoria"
        variant="outlined"
        size="small"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <FormControl size="small">
        <InputLabel>Tipo</InputLabel>
        <Select value={tipo} label="Tipo" onChange={(e) => setTipo(e.target.value)}>
          <MenuItem value="despesa">Despesa</MenuItem>
          <MenuItem value="provento">Provento</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained">
        Salvar Alterações
      </Button>
    </Box>
  );
}

export default FormularioEditarCategoria;