
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { formatPrice } from '../../../utils/priceUtils';

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <Dialog open={Boolean(order)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Detail de votre commande
        <Typography variant="subtitle2" color="text.secondary">
          Commande #{order.id}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Customer Information
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

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Période de location
            </Typography>
            <Typography>
              Du: {format(order.startDate.toDate(), 'PPP')}
            </Typography>
            <Typography>
              Au: {format(order.endDate.toDate(), 'PPP')}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Method de reception: {order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              produit de votre commande
            </Typography>
            {order.products.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
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
                      Quantités: {item.quantity} | {formatPrice(item.price)}/day
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
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">{formatPrice(order.total)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
