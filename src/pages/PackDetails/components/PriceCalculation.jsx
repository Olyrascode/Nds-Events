
// import { Box, Typography, Divider } from '@mui/material';
// import { calculateRentalDays } from '../../../utils/dateUtils';
// import { formatPrice } from '../../../utils/priceUtils';

// export default function PriceCalculation({ 
//   products,  // = [{ product: { price: 10, ... }, quantity: 2 }, ...]
//   quantity,
//   startDate,
//   endDate,
//   discountPercentage
// }) {
//   // Nombre de jours
//   const days = calculateRentalDays(startDate, endDate);

//   // Calcul du sous-total :
//   // 1) On additionne (prix du product * la quantity du product) pour chaque item
//   // 2) On multiplie par le "quantity" du pack (si c'est bien la "quantité de packs")
//   // 3) On multiplie par le nombre de jours
//   const subtotal = products.reduce((total, packItem) => {
//     // si "packItem.product" est manquant, fallback à 0
//     const unitPrice = packItem.product?.price ?? 0;
//     const qty = packItem.quantity ?? 1;
//     return total + (unitPrice * qty);
//   }, 0) * (quantity ?? 1) * (days || 0);

//   // Remise du pack
//   const discount = (subtotal * (discountPercentage || 0)) / 100;
//   const total = subtotal - discount;

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Détail du prix
//       </Typography>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Sous-total :</Typography>
//         <Typography>{formatPrice(subtotal)}</Typography>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Pack Discount ({discountPercentage}%) :</Typography>
//         <Typography color="success.main">-{formatPrice(discount)}</Typography>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Nombre de jours :</Typography>
//         <Typography>{days}</Typography>
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography variant="h6">Total :</Typography>
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

export default function PriceCalculation({ 
  products, 
  quantity,          // Nombre de "packs" 
  startDate, 
  endDate, 
  discountPercentage 
}) {
  // 1. Calcul du nombre de jours
  const days = calculateRentalDays(startDate, endDate);

  // 2. Prix de base du pack pour 1 jour
  //    (somme de (packItem.product.price * packItem.quantity) )
  //    Puis on multiplie par `quantity`, si c'est la quantité de packs
  const dailyPackPrice = products.reduce((acc, packItem) => {
    const unitPrice = packItem.product?.price ?? 0; 
    const itemQty = packItem.quantity ?? 1;
    return acc + (unitPrice * itemQty);
  }, 0) * (quantity ?? 1);

  /*
   Exemple :
     - Le pack contient :
         * 2 chaises à 5€ => 2*5=10
         * 1 table à 10€  => 10
       => dailyPackPrice = 20 € pour 1 pack
     - L'utilisateur veut 3 packs => 20*3 = 60€ par jour
  */

  // 3. Calcul du prix total selon la durée
  //    (logique "les 4 premiers jours au prix normal, puis +15% par jour supplémentaire")
  let totalWithoutDiscount;
  if (days <= 4) {
    // On paie dailyPackPrice (par jour) * days
    totalWithoutDiscount = dailyPackPrice;
  } else {
    // - on paie dailyPackPrice * 4 pour les 4 premiers jours
    // - puis +15% du dailyPackPrice pour chaque jour additionnel
    const extraDays = days - 4;
    totalWithoutDiscount = (dailyPackPrice) + (dailyPackPrice * 0.15 * extraDays);
  }

  // 4. Calcul de la remise
  const discount = (totalWithoutDiscount * (discountPercentage ?? 0)) / 100;
  const total = totalWithoutDiscount - discount;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Détail du prix
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Prix par jour (pour {quantity} pack(s)) :</Typography>
        <Typography>{formatPrice(dailyPackPrice)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Nombre total de jours :</Typography>
        <Typography>{days}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Sous-total (sans remise) :</Typography>
        <Typography>{formatPrice(totalWithoutDiscount)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Remise du pack ({discountPercentage}%) :</Typography>
        <Typography color="success.main">-{formatPrice(discount)}</Typography>
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
