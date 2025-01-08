import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserOrders } from '../services/orders.service';
import { formatPrice } from '../utils/priceUtils';
import DownloadIcon from '@mui/icons-material/Download';
import { generateInvoicePDF } from '../utils/invoiceGenerator';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadOrders();
  }, [currentUser]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userOrders = await fetchUserOrders(currentUser.uid);
      setOrders(userOrders.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (order) => {
    try {
      await generateInvoicePDF(order);
    } catch (err) {
      setError('Failed to generate invoice. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mes commandes
        </Typography>

        {orders.length === 0 ? (
          <Alert severity="info">
            Vous n'avez pas encore de commande.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Commande #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Produits</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      {format(order.createdAt.toDate(), 'PP')}
                    </TableCell>
                    <TableCell>
                      {order.products.length} Produit
                    </TableCell>
                    <TableCell>
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      {order.status}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          component={Link}
                          to="/order-confirmation"
                          state={{ order }}
                          size="small"
                        >
                          Voir
                        </Button>
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadInvoice(order)}
                          size="small"
                        >
                          Invoice
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}