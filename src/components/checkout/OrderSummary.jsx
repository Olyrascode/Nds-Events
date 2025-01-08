// import { Typography, Box, Divider, Paper } from '@mui/material';
// import { calculateOrderTotal, formatPrice } from '../../utils/priceUtils';
// import { calculateRentalDays } from '../../utils/dateUtils';

// export default function OrderSummary({ cart, startDate, endDate, deliveryMethod }) {
//   const { itemsTotal, deliveryFee, total } = calculateOrderTotal(
//     cart,
//     startDate,
//     endDate,
//     deliveryMethod
//   );
  
//   const days = calculateRentalDays(startDate, endDate);

//   return (
//     <Paper sx={{ p: 2, mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Résumé de commande
//       </Typography>

//       <Box sx={{ mb: 2 }}>
//         <Typography variant="body2" color="text.secondary">
//           Période de location: {days} jours
//         </Typography>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Produit total:</Typography>
//         <Typography>{formatPrice(itemsTotal)}</Typography>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Livraison gratuite:</Typography>
//         <Typography>{deliveryMethod === 'delivery' ? formatPrice(deliveryFee) : 'Free'}</Typography>
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography variant="h6">Total:</Typography>
//         <Typography variant="h6">{formatPrice(total)}</Typography>
//       </Box>
//     </Paper>
//   );
// }
import { Typography, Box, Divider, Paper } from '@mui/material';
import { calculateOrderTotal, formatPrice } from '../../utils/priceUtils';

export default function OrderSummary({ cart, deliveryMethod }) {
  // Utiliser les prix enregistrés dans le panier
  const { itemsTotal, deliveryFee, total } = calculateOrderTotal(cart, deliveryMethod);

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Résumé de commande
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Total des produits:</Typography>
        <Typography>{formatPrice(itemsTotal)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Frais de livraison:</Typography>
        <Typography>{deliveryMethod === 'delivery' ? formatPrice(deliveryFee) : 'Gratuit'}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">{formatPrice(total)}</Typography>
      </Box>
    </Paper>
  );
}
