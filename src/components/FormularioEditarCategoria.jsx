import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button, TextField, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';

function FormularioEditarCategoria({ categoriaParaEditar, onEdicaoConcluida }) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const { showNotification } = useNotification();

  useEffect(() => {
    if (categoriaParaEditar) {
      setNome(categoriaParaEditar.nome);
      setTipo(categoriaParaEditar.tipo);
    }
  }, [categoriaParaEditar]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase
        .from('categorias')
        .update({ nome, tipo })
        .eq('id', categoriaParaEditar.id)
        .select()
        .single();
        
      if (error) throw error;

      showNotification('Categoria atualizada com sucesso!', 'success');
      onEdicaoConcluida(data);
    } catch (error) {
      showNotification(`Não foi possível atualizar a categoria: ${error.message}`, 'error');
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