import { Box, Typography, Divider } from '@mui/material';
import { calculateRentalDays } from '../../../utils/dateUtils';
import { formatPrice } from '../../../utils/priceUtils';

export default function PriceCalculation({ 
  products, 
  quantity, 
  startDate, 
  endDate, 
  discountPercentage 
}) {
  const days = calculateRentalDays(startDate, endDate);
  
  const subtotal = products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0) * quantity * days;

  const discount = (subtotal * discountPercentage) / 100;
  const total = subtotal - discount;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Detail du prix
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Subtotal:</Typography>
        <Typography>{formatPrice(subtotal)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Pack Discount ({discountPercentage}%):</Typography>
        <Typography color="success.main">-{formatPrice(discount)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Nombre de jours:</Typography>
        <Typography>{days}</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6" color="primary">
          {formatPrice(total)}
        </Typography>
      </Box>
    </Box>
  );
}