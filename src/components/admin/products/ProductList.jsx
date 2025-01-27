import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchProducts } from '../../../services/products.service';
import { fetchPacks } from '../../../services/packs.service';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import EditProductDialog from './EditProductDialog';
import { formatCurrency } from '../../../utils/formatters';

export default function ProductList() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, items]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both products and packs
      const [products, packs] = await Promise.all([fetchProducts(), fetchPacks()]);

      // Add type identifier to each item
      const formattedProducts = products.map((product) => ({
        ...product,
        type: 'product'
      }));

      const formattedPacks = packs.map((pack) => ({
        ...pack,
        type: 'pack',
        title: pack.name, // Normalize pack name to match product title
        price: calculatePackPrice(pack)
      }));

      // Combine and sort by title
      const allItems = [...formattedProducts, ...formattedPacks].sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      setItems(allItems);
      setFilteredItems(allItems); // Initialize filtered items
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePackPrice = (pack) => {
    if (!pack.products) return 0;
    return (
      pack.products.reduce((total, product) => {
        const basePrice = product.price * product.quantity;
        return total + basePrice;
      }, 0) * (1 - (pack.discountPercentage || 0) / 100)
    );
  };

  const filterItems = () => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.category?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.type.toLowerCase().includes(lowerCaseSearchTerm)
    );

    setFilteredItems(filtered);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    // Vérifie que l'ID de l'item est bien défini
    if (!item._id) {
      console.error('Produit ID est manquant :', item); // Affiche un message d'erreur dans la console
      return; // Si l'ID est manquant, arrête l'exécution
    }
    
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  

  const handleEditSuccess = () => {
    loadItems();
    setIsEditDialogOpen(false);
  };

  const handleDeleteSuccess = () => {
    loadItems();
    setIsDeleteDialogOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Liste des Produits et Packs
      </Typography>

      <TextField
        label="Rechercher par nom, catégorie ou type"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        style={{ marginBottom: '16px' }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell align="right">Prix par jour</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                  )}
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Chip
                    label={item.type === 'pack' ? 'Package' : 'Product'}
                    color={item.type === 'pack' ? 'secondary' : 'primary'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell align="right">
                  {formatCurrency(item.price)}
                  {item.type === 'pack' && (
                    <Typography variant="caption" color="success.main" display="block">
                      {item.discountPercentage}% off
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">{item.stock || 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditClick(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(item)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditProductDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        item={selectedItem}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        item={selectedItem}
        onSuccess={handleDeleteSuccess}
      />
    </Box>
  );
}
