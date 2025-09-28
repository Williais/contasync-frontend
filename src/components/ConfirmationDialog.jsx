import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function ConfirmationDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose} // Função para fechar se o usuário clicar fora
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {/* A mensagem informativa que queremos mostrar */}
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {/* Botão de Cancelar simplesmente fecha o diálogo */}
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        {/* Botão de Confirmar executa a função de confirmação e fecha o diálogo */}
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;