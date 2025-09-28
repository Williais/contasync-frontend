// src/components/FormularioEditarTransacao.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';

function FormularioEditarTransacao({ transacaoParaEditar, onEdicaoConcluida }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataTransacao, setDataTransacao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [tipoTransacao, setTipoTransacao] = useState('despesa');
  const [tipoDespesa, setTipoDespesa] = useState('fixa');
  const [dataVencimento, setDataVencimento] = useState('');
  const [precisaAviso, setPrecisaAviso] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    axios.get('http://localhost:3000/categorias')
      .then(response => setCategorias(response.data))
      .catch(e => console.error('Erro ao buscar as Categorias: ', e));
  }, []);
  
  useEffect(() => {
    if (transacaoParaEditar) {
      setDescricao(transacaoParaEditar.descricao);
      setValor(transacaoParaEditar.valor);
      setDataTransacao(transacaoParaEditar.data_transacao ? new Date(transacaoParaEditar.data_transacao).toISOString().split('T')[0] : '');
      setCategoriaId(transacaoParaEditar.categoria_id || '');
      setTipoTransacao(transacaoParaEditar.tipo_transacao);
      setTipoDespesa(transacaoParaEditar.tipo_despesa || 'fixa');
      setDataVencimento(transacaoParaEditar.data_vencimento ? new Date(transacaoParaEditar.data_vencimento).toISOString().split('T')[0] : '');
      setPrecisaAviso(transacaoParaEditar.precisa_aviso || false);
    }
  }, [transacaoParaEditar]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const transacaoAtualizada = {
      descricao, valor: parseFloat(valor), data_transacao: dataTransacao,
      categoria_id: parseInt(categoriaId), tipo_transacao: tipoTransacao,
      tipo_despesa: tipoTransacao === 'despesa' ? tipoDespesa : null,
      data_vencimento: (tipoTransacao === 'despesa' && dataVencimento) ? dataVencimento : null,
      precisa_aviso: tipoTransacao === 'despesa' ? precisaAviso : false,
    };

    try {
      const response = await axios.put(`http://localhost:3000/transacoes/${transacaoParaEditar.id}`, transacaoAtualizada);
      showNotification('Transação atualizada com sucesso!', 'success');
      onEdicaoConcluida(response.data);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      showNotification('Não foi possível atualizar a transação.', 'error');
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
      <TextField label='Descrição' variant="outlined" size="small" fullWidth value={descricao} onChange={(e) => setDescricao(e.target.value)} required sx={{ gridColumn: 'span 2' }}/>
      <TextField label='Valor' type="number" variant='outlined' size="small" fullWidth value={valor} onChange={(e) => setValor(e.target.value)} required/>
      <TextField label='Data da Transação' type="date" size="small" variant='outlined' fullWidth value={dataTransacao} onChange={(e) => setDataTransacao(e.target.value)} InputLabelProps={{ shrink: true }} required/>
      <FormControl size="small" fullWidth>
          <InputLabel>Tipo de Transação</InputLabel>
          <Select label='Tipo da Transação' value={tipoTransacao} onChange={(e) => setTipoTransacao(e.target.value)} required disabled>
              <MenuItem value='despesa'>Despesa</MenuItem>
              <MenuItem value='provento'>Provento</MenuItem>
          </Select>
      </FormControl>
      <FormControl size="small" fullWidth>
          <InputLabel>Categoria</InputLabel>
          <Select value={categoriaId} label="Categoria" onChange={(e) => setCategoriaId(e.target.value)} required>
              {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.nome}</MenuItem>
              ))}
          </Select>
      </FormControl>
      {tipoTransacao === 'despesa' && (
          <>
              <FormControl size="small" fullWidth>
                  <InputLabel>Tipo da Despesa</InputLabel>
                  <Select value={tipoDespesa} label='Tipo da Despesa' onChange={(e) => setTipoDespesa(e.target.value)} required>
                      <MenuItem value="fixa">Fixa</MenuItem>
                      <MenuItem value="temporaria">Temporária</MenuItem>
                      <MenuItem value="unica">Única</MenuItem>
                  </Select>
              </FormControl>
              <TextField label="Data de Vencimento" type="date" size="small" variant='outlined' fullWidth value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} InputLabelProps={{ shrink: true }}/>
              <FormControlLabel control={ <Checkbox checked={precisaAviso} onChange={(e) => setPrecisaAviso(e.target.checked)} /> } label="Receber aviso para esta despesa" sx={{ gridColumn: 'span 2' }}/>
          </>
      )}
      <Button type='submit' variant="contained" sx={{ gridColumn: 'span 2'}}>Salvar Alterações</Button>
    </Box>
  );
}

export default FormularioEditarTransacao;