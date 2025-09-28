import { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, Box, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';


axios.defaults.withCredentials = true;
// 1. Nome do componente em PascalCase
function FormularioTransacao({ onTransacaoAdicionada, categorias }) { // Recebe categorias via props
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [dataTransacao, setDataTransacao] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [tipoTransacao, setTipoTransacao] = useState('despesa');
    const [tipoDespesa, setTipoDespesa] = useState('fixa');
    const [dataVencimento, setDataVencimento] = useState('');
    const [precisaAviso, setPrecisaAviso] = useState(false);
    
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const novaTransacao = {
            descricao, valor: parseFloat(valor), data_transacao: dataTransacao,
            categoria_id: parseInt(categoriaId), tipo_transacao: tipoTransacao,
            tipo_despesa: tipoTransacao === 'despesa' ? tipoDespesa : null,
            data_vencimento: (tipoTransacao === 'despesa' && dataVencimento) ? dataVencimento : null,
            precisa_aviso: tipoTransacao === 'despesa' ? precisaAviso : false,
        };

        try {
            const response = await axios.post('http://localhost:3000/transacoes', novaTransacao);
            onTransacaoAdicionada(response.data);
            setDescricao(''); setValor(''); setDataTransacao(''); setCategoriaId('');
            setTipoTransacao('despesa'); setTipoDespesa('fixa'); setDataVencimento(''); setPrecisaAviso(false);
            showNotification('Transação criada com sucesso!', 'success');
        } catch (e) {
            console.error('Erro ao criar transação:', e);
            showNotification('Erro ao criar transação.', 'error');
        }
    };
    
     const handleCategoryChange = (event) => {
        const selectedId = event.target.value;
        setCategoriaId(selectedId);

        const categoriaSelecionada = categorias.find(cat => cat.id === parseInt(selectedId));

        if (categoriaSelecionada) {
            setTipoTransacao(categoriaSelecionada.tipo);
        }
    };
    
    // Esta função zera a categoria selecionada se o tipo for mudado manualmente
    const handleTypeChange = (event) => {
        setTipoTransacao(event.target.value);
        setCategoriaId(''); // Limpa a categoria para evitar inconsistências
    };

    return (
        <Box component='form' onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextField label='Descrição' variant="outlined" size="small" fullWidth value={descricao} onChange={(e) => setDescricao(e.target.value)} required sx={{ gridColumn: 'span 2' }}/>
            <TextField label='Valor' type="number" variant='outlined' size="small" fullWidth value={valor} onChange={(e) => setValor(e.target.value)} required/>
            <TextField label='Data da Transação' type="date" size="small" variant='outlined' fullWidth value={dataTransacao} onChange={(e) => setDataTransacao(e.target.value)} InputLabelProps={{ shrink: true }} required/>
            
            <FormControl size="small" fullWidth>
                <InputLabel>Tipo de Transação</InputLabel>
                <Select 
                    label='Tipo da Transação' 
                    value={tipoTransacao} 
                    onChange={handleTypeChange} // Usa o novo handler
                    required
                    // O campo agora só é desabilitado SE uma categoria já foi escolhida
                    disabled={!!categoriaId} 
                >
                    <MenuItem value='despesa'>Despesa</MenuItem>
                    <MenuItem value='provento'>Provento</MenuItem>
                </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select value={categoriaId} label="Categoria" onChange={handleCategoryChange} required>
                    {/* Agora mostra TODAS as categorias */}
                    {categorias.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* --- BLOCO CONDICIONAL ATUALIZADO --- */}
            {tipoTransacao === 'despesa' && (
                <> {/* Usamos um fragment <> para agrupar os novos campos */}
                    <FormControl size="small" fullWidth>
                        <InputLabel>Tipo da Despesa</InputLabel>
                        <Select value={tipoDespesa} label='Tipo da Despesa' onChange={(e) => setTipoDespesa(e.target.value)} required>
                            <MenuItem value="fixa">Fixa</MenuItem>
                            <MenuItem value="temporaria">Temporária</MenuItem>
                            <MenuItem value="unica">Única</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Data de Vencimento"
                        type="date"
                        size="small"
                        variant='outlined'
                        fullWidth
                        value={dataVencimento}
                        onChange={(e) => setDataVencimento(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={precisaAviso} 
                                onChange={(e) => setPrecisaAviso(e.target.checked)} // Checkbox usa 'e.target.checked'
                            />
                        }
                        label="Receber aviso para esta despesa"
                        sx={{ gridColumn: 'span 2' }} // Ocupa a largura total
                    />
                </>
            )}

            <Button type='submit' variant="contained" sx={{ gridColumn: 'span 2'}}>Adicionar Transação</Button>
        </Box>
    );
}

// 1. Nome do componente em PascalCase
export default FormularioTransacao;