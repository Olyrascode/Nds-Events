import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { deleteProduct } from '../../../services/products.service';
import { deletePack } from '../../../services/packs.service';

export default function DeleteConfirmDialog({ open, onClose, item, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (item.type === 'pack') {
        await deletePack(item.id);
      } else {
        await deleteProduct(item.id);
      }
      
      onSuccess();
    } catch (error) {
      setError(`Failed to delete ${item.type}. Please try again.`);
      console.error(`Error deleting ${item.type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmer la suppression</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          Etes vous sur de vouloir supprimer "{item.title}"? Cette action est definitive.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Deleting...' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}