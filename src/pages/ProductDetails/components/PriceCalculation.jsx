
import { Box, Typography, Divider } from '@mui/material';
import { calculateRentalDays } from '../../../utils/dateUtils';
import { formatPrice } from '../../../utils/priceUtils';

export default function PriceCalculation({
  price,
  quantity,
  startDate,
  endDate,
  selectedOptions,
}) {
  const days = calculateRentalDays(startDate, endDate);

  // Somme des prix des options sélectionnées
  let optionPricePerDay = 0;
  if (selectedOptions) {
    Object.values(selectedOptions).forEach(opt => {
      optionPricePerDay += opt.price;
    });
  }

  // Prix unitaire par jour (produit + options)
  const dailyUnitPrice = price + optionPricePerDay;

  // Prix de base pour "jusqu'à 4 jours"
  let basePrice = dailyUnitPrice * quantity;

  if (days > 4) {
    const extraDays = days - 4;
    basePrice += 0.15 * basePrice * extraDays;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Détail du prix
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Prix unitaire (par jour) :</Typography>
        <Typography>{formatPrice(price)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Quantité :</Typography>
        <Typography>{quantity}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Nombre total de jours :</Typography>
        <Typography>{days}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Total :</Typography>
        <Typography variant="h6" color="primary">
          {formatPrice(basePrice)}
        </Typography>
      </Box>
    </Box>
  );
}
