import { useEffect, useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { formatPrice } from '../utils/priceUtils';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { generateInvoicePDF } from '../utils/invoiceGenerator';

export default function OrderConfirmation() {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    }
  }, [location]);

  if (!order) {
    return <Navigate to="/" />;
  }

  const handleDownloadInvoice = async () => {
    try {
      await generateInvoicePDF(order);
    } catch (err) {
      setError('Failed to generate invoice. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            component={Link}
            to="/account/orders"
            startIcon={<ArrowBackIcon />}
          >
            Voir toute les commandes
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadInvoice}
          >
            Télécharger votre facture
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom color="success.main">
            Commande confirmée!
          </Typography>
          <Typography variant="subtitle1">
            Commande #{order.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {format(order.createdAt.toDate(), 'PPP')}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informations de facturation
            </Typography>
            <Typography>
              {order.billingInfo.firstName} {order.billingInfo.lastName}
            </Typography>
            <Typography>{order.billingInfo.email}</Typography>
            <Typography>{order.billingInfo.phone}</Typography>
            <Typography>{order.billingInfo.address}</Typography>
            <Typography>
              {order.billingInfo.city}, {order.billingInfo.zipCode}
            </Typography>
          </Grid>

          {order.deliveryMethod === 'delivery' && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations de livraisons
              </Typography>
              <Typography>{order.shippingInfo.address}</Typography>
              <Typography>
                {order.shippingInfo.city}, {order.shippingInfo.zipCode}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Detail de votre commande
        </Typography>

        {order.products.map((item) => (
          <Box key={item.id} sx={{ mb: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  style={{ width: 60, height: 60, objectFit: 'cover' }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="subtitle1">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantité: {item.quantity} | {formatPrice(item.price)}/jour
                </Typography>
                {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, value]) => (
                  <Typography key={key} variant="body2" color="text.secondary">
                    {key}: {value}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Période de location:</Typography>
          <Typography>
            {format(order.startDate.toDate(), 'PP')} - {format(order.endDate.toDate(), 'PP')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Method de reception:</Typography>
          <Typography>
            {order.deliveryMethod === 'delivery' ? 'Delivery (€60.00)' : 'Pickup (Free)'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">{formatPrice(order.total)}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}