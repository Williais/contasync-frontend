import { Paper, Typography, Box, Divider } from '@mui/material';

function ResumoCard({ titulo, valor, cor, detalhe }) {

  const formatarMoeda = (num) => num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {titulo}
      </Typography>
      <Typography variant="h4" sx={{ color: cor, fontWeight: 'bold', mb: 1 }}>
        {formatarMoeda(valor)}
      </Typography>
      
      {/* --- NOVIDADE AQUI --- */}
      {detalhe && detalhe.valor > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ mt: 1, textAlign: 'left' }}>
            <Typography variant="caption" color="textSecondary">
              Maior do período:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {detalhe.descricao} ({formatarMoeda(detalhe.valor)})
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}

export default ResumoCard;