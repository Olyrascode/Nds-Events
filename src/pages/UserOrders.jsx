import { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';

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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
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
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [generatePDF, setGeneratePDF] = useState(false);

  const invoiceRef = useRef();

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
    if (!order) {
      console.error('No order provided for invoice generation.');
      return;
    }
  
    try {
      await generateInvoicePDF(order); // Appel à votre fichier invoiceGenerator.js
    } catch (err) {
      console.error('Failed to generate invoice:', err);
      setError('Impossible de générer la facture. Veuillez réessayer.');
    }
  };
  
  
  
  

  const handleOpenInvoiceModal = (order) => {
    setSelectedOrder(order);
    setOpenInvoiceModal(true);
  };

  const handleCloseInvoiceModal = () => {
    setSelectedOrder(null);
    setOpenInvoiceModal(false);
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
                          onClick={() => handleOpenInvoiceModal(order)}
                          size="small"
                        >
                          Voir
                        </Button>
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadInvoice(order)}
                          size="small"
                        >
                          Télécharger la facture
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

      {/* Modal pour afficher la facture */}
      <Dialog
        open={openInvoiceModal}
        onClose={handleCloseInvoiceModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Facture pour la commande #{selectedOrder?.id}</DialogTitle>
        <DialogContent dividers>
  <Box ref={invoiceRef} sx={{ p: 3 }}>
    {selectedOrder && (
      <>
        <Typography variant="h6" gutterBottom>
          Détails de la facture
        </Typography>
        <Typography>Date : {format(selectedOrder.createdAt.toDate(), 'PP')}</Typography>
        <Typography>
          Nom : {`${selectedOrder.billingInfo.firstName} ${selectedOrder.billingInfo.lastName}`}
        </Typography>
        <Typography>Adresse : {selectedOrder.billingInfo.address}</Typography>
        <Typography>Total : {formatPrice(selectedOrder.total)}</Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Produits :</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produit</TableCell>
                <TableCell>Quantité</TableCell>
                <TableCell>Prix/jour</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrder.products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </>
    )}
  </Box>
</DialogContent>


      </Dialog>
    </Container>
  );
}
