// src/components/FormularioEditarLembrete.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button, TextField, Box, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';

function FormularioEditarLembrete({ lembreteParaEditar, onEdicaoConcluida }) {
  const [descricao, setDescricao] = useState('');
  const [valorEstimado, setValorEstimado] = useState('');
  const [tipo, setTipo] = useState('fixo');
  const [diaVencimento, setDiaVencimento] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const { showNotification } = useNotification();

  // Este useEffect preenche o formulário quando um lembrete é selecionado
  useEffect(() => {
    if (lembreteParaEditar) {
      setDescricao(lembreteParaEditar.descricao);
      setValorEstimado(lembreteParaEditar.valor_estimado || '');
      setTipo(lembreteParaEditar.tipo);
      setDiaVencimento(lembreteParaEditar.dia_vencimento);
      // Formata as datas para o formato YYYY-MM-DD que o input espera
      setDataInicio(lembreteParaEditar.data_inicio ? new Date(lembreteParaEditar.data_inicio).toISOString().split('T')[0] : '');
      setDataFinal(lembreteParaEditar.data_final ? new Date(lembreteParaEditar.data_final).toISOString().split('T')[0] : '');
    }
  }, [lembreteParaEditar]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const lembreteAtualizado = {
      descricao,
      valor_estimado: parseFloat(valorEstimado) || null,
      tipo,
      dia_vencimento: parseInt(diaVencimento),
      data_inicio: tipo === 'temporario' ? dataInicio : null,
      data_final: tipo === 'temporario' ? dataFinal : null,
    };

    try {
      const { data, error } = await supabase
        .from('lembretes')
        .update(lembreteAtualizado)
        .eq('id', lembreteParaEditar.id)
        .select()
        .single();

      if (error) throw error;
      showNotification('Lembrete atualizado com sucesso!', 'success');
      onEdicaoConcluida(data);
    } catch (error) {
      showNotification(`Erro ao atualizar lembrete: ${error.message}`, 'error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <TextField label="Descrição do Lembrete" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
      <Grid container spacing={2}>
        <Grid item xs={6}><TextField label="Valor Estimado (R$)" type="number" value={valorEstimado} onChange={(e) => setValorEstimado(e.target.value)} /></Grid>
        <Grid item xs={6}><TextField label="Dia do Vencimento (1-31)" type="number" value={diaVencimento} onChange={(e) => setDiaVencimento(e.target.value)} required /></Grid>
      </Grid>
      <FormControl fullWidth>
        <InputLabel>Tipo de Lembrete</InputLabel>
        <Select value={tipo} label="Tipo de Lembrete" onChange={(e) => setTipo(e.target.value)}>
          <MenuItem value="fixo">Fixo (Ex: Aluguel, Assinaturas)</MenuItem>
          <MenuItem value="temporario">Temporário (Ex: Parcelamentos)</MenuItem>
        </Select>
      </FormControl>

      {tipo === 'temporario' && (
        <Grid container spacing={2}>
          <Grid item xs={6}><TextField label="Data de Início" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} InputLabelProps={{ shrink: true }} required={tipo === 'temporario'} /></Grid>
          <Grid item xs={6}><TextField label="Data Final" type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} InputLabelProps={{ shrink: true }} required={tipo === 'temporario'} /></Grid>
        </Grid>
      )}

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Salvar Alterações</Button>
    </Box>
  );
}
export default FormularioEditarLembrete;