// import { Box, Typography, Divider } from '@mui/material';
// import { calculateRentalDays } from '../../../utils/dateUtils';
// import { formatPrice } from '../../../utils/priceUtils';

// export default function PriceCalculation({ price, quantity, startDate, endDate }) {
//   const days = calculateRentalDays(startDate, endDate);
//   const total = price * quantity * days;

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Detail du prix
//       </Typography>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Prix par jour:</Typography>
//         <Typography>{formatPrice(price)}</Typography>
//       </Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Quantité:</Typography>
//         <Typography>{quantity}</Typography>
//       </Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Nombre de jours:</Typography>
//         <Typography>{days}</Typography>
//       </Box>
//       <Divider sx={{ my: 2 }} />
//       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography variant="h6">Total:</Typography>
//         <Typography variant="h6" color="primary">
//           {formatPrice(total)}
//         </Typography>
//       </Box>
//     </Box>
//   );
// }
import { Box, Typography, Divider } from '@mui/material';
import { calculateRentalDays } from '../../../utils/dateUtils';
import { formatPrice } from '../../../utils/priceUtils';

export default function PriceCalculation({ price, quantity, startDate, endDate }) {
  // Calcul du nombre de jours
  const days = calculateRentalDays(startDate, endDate);

  // Prix de base pour "jusqu'à 4 jours"
  const basePrice = price * quantity;

  let total;
  if (days <= 4) {
    // Le prix est le même pour 1 à 4 jours
    total = basePrice;
  } else {
    // Au-delà de 4 jours, +15% du prix de base par jour supplémentaire
    const extraDays = days - 4;
    const dailyExtra = 0.15 * basePrice; 
    total = basePrice + (dailyExtra * extraDays);
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
          {formatPrice(total)}
        </Typography>
      </Box>
    </Box>
  );
}
