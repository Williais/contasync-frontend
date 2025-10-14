import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Button, TextField, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';

function FormularioCategoria({ onCategoriaAdicionada }) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const { showNotification } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nome) {
      showNotification('Por favor, preencha o nome da categoria.', 'warning');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('categorias')
        .insert({ nome, tipo })
        .select()
        .single();

      if (error) throw error;

      showNotification('Categoria criada com sucesso!', 'success');
      onCategoriaAdicionada(data);
      setNome('');
    } catch (error) {
      showNotification(`Não foi possível criar a categoria: ${error.message}`, 'error');
    }
  };
  
  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}
    >
      <TextField
        label="Nome da Categoria"
        variant="outlined"
        size="small"
        value={nome}
        onChange={(e) => setNome(e.target.value)} // Atualiza o estado 'nome' a cada letra digitada
        required
      />

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Tipo</InputLabel>
        <Select
          value={tipo}
          label="Tipo"
          onChange={(e) => setTipo(e.target.value)} // Atualiza o estado 'tipo' quando a opção muda
        >
          <MenuItem value="despesa">Despesa</MenuItem>
          <MenuItem value="provento">Provento</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained">
        Adicionar
      </Button>
    </Box>
  );
}

export default FormularioCategoria;