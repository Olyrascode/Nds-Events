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
  <DialogTitle>
    Facture pour la commande #{selectedOrder?.id}
  </DialogTitle>
  <DialogContent dividers>
    {selectedOrder && (
      <Box sx={{ p: 3 }}>
        {/* En-tête : logo et informations principales */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h6">NDS Event's</Typography>
            <Typography variant="body2">
              8 Avenue Victor Hugo, 38130 Échirolles
            </Typography>
            <Typography variant="body2">Tél : 04-80-80-98-51</Typography>
            <Typography variant="body2">contact@nds-events.fr</Typography>
          </Box>
          <Box>
            <img
              src="../../img/divers/nds-events-logo.png"
              alt="Logo"
              style={{ height: 80 }}
            />
          </Box>
        </Box>

        {/* Informations client */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">À l'attention de :</Typography>
          <Typography variant="body2">
            {`${selectedOrder.billingInfo.firstName} ${selectedOrder.billingInfo.lastName}`}
          </Typography>
          <Typography variant="body2">
            {selectedOrder.billingInfo.address}
          </Typography>
          <Typography variant="body2">
            {`${selectedOrder.billingInfo.zipCode} ${selectedOrder.billingInfo.city}`}
          </Typography>
          <Typography variant="body2">
            Date de la facture : {format(selectedOrder.createdAt.toDate(), 'PP')}
          </Typography>
        </Box>

        {/* Tableau des produits */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Détails des produits
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Réf. article</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Qté</TableCell>
                <TableCell>PU HT</TableCell>
                <TableCell>Mtt HT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrder.products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.reference || 'N/A'}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    {formatPrice(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totaux */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1">
            Sous-total HT : {formatPrice(selectedOrder.subTotal)}
          </Typography>
          <Typography variant="body1">
            TVA ({selectedOrder.taxRate}%) :{' '}
            {formatPrice(selectedOrder.taxAmount)}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Total TTC : {formatPrice(selectedOrder.total)}
          </Typography>
        </Box>

        {/* Note finale */}
        <Box sx={{ mt: 3, fontSize: '0.9rem', color: 'gray' }}>
          <Typography>
            Les ventes sont conclues avec réserve de propriété. Le transfert de
            propriété n'intervient qu'après paiement complet.
          </Typography>
          <Typography>
            En cas de retard de paiement, des pénalités de retard seront
            appliquées selon l'article L 441-6 du Code de commerce.
          </Typography>
        </Box>
      </Box>
    )}
  </DialogContent>
</Dialog>

    </Container>
  );
}
