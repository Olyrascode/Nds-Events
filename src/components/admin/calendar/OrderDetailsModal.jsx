
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
//   Grid,
//   Divider
// } from '@mui/material';
// import { format } from 'date-fns';
// import { formatPrice } from '../../../utils/priceUtils';

// export default function OrderDetailsModal({ order, onClose }) {
//   if (!order) return null;

//   return (
//     <Dialog open={Boolean(order)} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>
//         Detail de votre commande
//         <Typography variant="subtitle2" color="text.secondary">
//           Commande #{order.id}
//         </Typography>
//       </DialogTitle>
      
//       <DialogContent>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" gutterBottom>
//               Customer Information
//             </Typography>
//             <Typography>
//               {order.billingInfo.firstName} {order.billingInfo.lastName}
//             </Typography>
//             <Typography>{order.billingInfo.email}</Typography>
//             <Typography>{order.billingInfo.phone}</Typography>
//             <Typography>{order.billingInfo.address}</Typography>
//             <Typography>
//               {order.billingInfo.city}, {order.billingInfo.zipCode}
//             </Typography>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" gutterBottom>
//               Période de location
//             </Typography>
//             <Typography>
//               Du: {format(new Date(order.startDate), 'PPP')}
//             </Typography>
//             <Typography>
//               Au: {format(new Date(order.endDate), 'PPP')}
//             </Typography>

//             <Typography sx={{ mt: 2 }}>
//               Method de reception: {order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}
//             </Typography>
//           </Grid>

//           <Grid item xs={12}>
//             <Divider sx={{ my: 2 }} />
//             <Typography variant="h6" gutterBottom>
//               produit de votre commande
//             </Typography>
//             {order.products.map((item) => (
//               <Box key={item.id} sx={{ mb: 2 }}>
//                 <Grid container spacing={2} alignItems="center">
//                   <Grid item>
//                     <img
//                       src={item.imageUrl}
//                       alt={item.title}
//                       style={{ width: 60, height: 60, objectFit: 'cover' }}
//                     />
//                   </Grid>
//                   <Grid item xs>
//                     <Typography variant="subtitle1">{item.title}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       Quantités: {item.quantity} | {formatPrice(item.price)}/day
//                     </Typography>
//                     {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, value]) => (
//                       <Typography key={key} variant="body2" color="text.secondary">
//                         {key}: {value}
//                       </Typography>
//                     ))}
//                   </Grid>
//                 </Grid>
//               </Box>
//             ))}
//           </Grid>

//           <Grid item xs={12}>
//             <Divider sx={{ my: 2 }} />
//             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//               <Typography variant="h6">Total:</Typography>
//               <Typography variant="h6">{formatPrice(order.total)}</Typography>
//             </Box>
//           </Grid>
//         </Grid>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={onClose}>Fermer</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
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
import { fr } from 'date-fns/locale';
import { formatPrice } from '../../../utils/priceUtils';

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <Dialog open={Boolean(order)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="p">Détail de votre commande</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Commande #{order.id}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* 🏷 Infos client */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informations du client
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

          {/* 🏷 Période de location */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Période de location
            </Typography>
            <Typography>
              Du: {format(new Date(order.startDate), 'PPP', { locale: fr })}
            </Typography>
            <Typography>
              Au: {format(new Date(order.endDate), 'PPP', { locale: fr })}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Méthode de réception: {order.deliveryMethod === 'delivery' ? 'Livraison' : 'Retrait'}
            </Typography>
          </Grid>

          {/* 🏷 Produits commandés */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Produits de votre commande
            </Typography>
            {order.products.map((item, index) => (
              <Box key={item.id || index} sx={{ mb: 2 }}>
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
                      Quantité: {item.quantity} | {formatPrice(item.price)}/jour
                    </Typography>
                    {/* ✅ Correction pour afficher `selectedOptions` */}
                    {Array.isArray(item.selectedOptions) &&
                      item.selectedOptions.map((option, idx) => (
                        <Typography key={idx} variant="body2" color="text.secondary">
                          {option.name}: {option.value} ({formatPrice(option.price)})
                        </Typography>
                      ))}
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>

          {/* 🏷 Total */}
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
