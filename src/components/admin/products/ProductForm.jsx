import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import ImageUpload from '../common/ImageUpload/ImageUpload';
import OptionsManager from './OptionsManager';

export default function ProductForm({ 
  initialData = {}, 
  onSubmit, 
  submitLabel = 'Create Product',
  loading = false 
}) {
  const [product, setProduct] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    price: initialData.price || '',
    minQuantity: initialData.minQuantity || '',
    stock: initialData.stock || '',
    category: initialData.category || '',
    image: null,
    options: initialData.options || []
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(product);
      // Reset form on success
      setProduct({
        title: '',
        description: '',
        price: '',
        minQuantity: '',
        stock: '',
        category: '',
        image: null,
        options: []
      });
    } catch (error) {
      setError(error.message || 'Failed to process product');
    }
  };

  const handleImageChange = (file) => {
    setProduct({ ...product, image: file });
  };

  const handleOptionsChange = (newOptions) => {
    setProduct({ ...product, options: newOptions });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <ImageUpload 
        onChange={handleImageChange}
        currentImage={initialData.imageUrl}
      />

      <TextField
        fullWidth
        label="Titre"
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
        margin="normal"
        required
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Description"
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        margin="normal"
        multiline
        rows={4}
        required
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Prix par jours"
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        margin="normal"
        required
        inputProps={{ min: 0, step: "0.01" }}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Quantité minimum par location"
        type="number"
        value={product.minQuantity}
        onChange={(e) => setProduct({ ...product, minQuantity: e.target.value })}
        margin="normal"
        required
        inputProps={{ min: 1 }}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Stock disponnible"
        type="number"
        value={product.stock}
        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
        margin="normal"
        required
        inputProps={{ min: 0 }}
        disabled={loading}
      />

      <FormControl fullWidth margin="normal" required disabled={loading}>
        <InputLabel>Categorie</InputLabel>
        <Select
          value={product.category}
          label="Categorie"
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
        >
          <MenuItem value="tables">Tables</MenuItem>
          <MenuItem value="couverts">Couverts</MenuItem>
          <MenuItem value="tasses et bols">Tasses et Bols</MenuItem>
          <MenuItem value="assiettes">Assiettes</MenuItem>
          <MenuItem value="verre">Verres</MenuItem>
          <MenuItem value="nappe et serviette">Nappes et Serviettes</MenuItem>
          <MenuItem value="plats, contenants et service">Plats, contenants et service</MenuItem>
          <MenuItem value="chaises et bancs">Chaises et Bancs</MenuItem>
          <MenuItem value="tables et mange-debout">Table et mange-debout</MenuItem>
          <MenuItem value="housses lycra">Housses Lycra</MenuItem>
          <MenuItem value="mobilier lounge">Mobilier lounge</MenuItem>
          <MenuItem value="mobilier, bars et accessoires lumineux">Mobilier, bars et accessoires lumineux</MenuItem>
          <MenuItem value="mobiliers et materiels divers">Mobiliers et matériels divers</MenuItem>
          <MenuItem value="bornes a selfies">Bornes à Selfies</MenuItem>
          <MenuItem value='Tentes'>Tentes</MenuItem>
          
        </Select>
      </FormControl>

      <OptionsManager
        options={product.options}
        onChange={handleOptionsChange}
        disabled={loading}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          submitLabel
        )}
      </Button>
    </Box>
  );
}