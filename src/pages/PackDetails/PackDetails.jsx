// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useCart } from '../../contexts/CartContext';
// import { Container, Typography, Paper, Box, Button, Alert } from '@mui/material';
// import RentalPeriod from '../ProductDetails/components/RentalPeriod';
// import QuantitySelector from '../ProductDetails/components/QuantitySelector';
// import PackProducts from './components/PackProducts';
// import PriceCalculation from './components/PriceCalculation';
// import { fetchPackById } from '../../services/packs.service';
// import { isPackAvailable } from '../../utils/dateUtils';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { fr } from 'date-fns/locale';
// import { addDays } from 'date-fns';

// import './PackDetails.scss';

// export default function PackDetails() {
//   const { packId } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const [pack, setPack] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   useEffect(() => {
//     loadPack();
//   }, [packId]);

//   const loadPack = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const packData = await fetchPackById(packId);
//       setPack(packData);
//       setQuantity(packData.minQuantity || 1);
//     } catch (err) {
//       setError('Failed to load pack details');
//       console.error('Error loading pack:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!isPackAvailable(pack, startDate, endDate, quantity)) {
//       setError("Le pack n'est pas disponnible pour les dates selectionées ou les quantités");
//       return;
//     }

//     const rentalDays = calculateRentalDays(startDate, endDate);
//     if (rentalDays < pack.minRentalDays) {
//       setError(`Le minimum de jour de location pour ce pack est de  ${pack.minRentalDays} jours`);
//       return;
//     }

//     addToCart({
//       ...pack,
//       type: 'pack',
//       quantity,
//       startDate,
//       endDate
//     });
//     navigate('/cart');
//   };

//   if (loading) return <div className="pack-details__loading">Chargement...</div>;
//   if (error) return <Alert severity="error">{error}</Alert>;
//   if (!pack) return <Alert severity="error">Pack introuvable</Alert>;

//   const today = new Date();
//   const minStartDate = addDays(today, 2); // Bloque les deux prochains jours


//   return (
//     <div className="pack-details">
//       <Container>
//         <Paper className="pack-details__content">
//             <Typography variant="h1" className="pack-details__title">
//               {pack.name}
//             </Typography>
//           <div className="pack-details__header">
//             {pack.imageUrl && (
//               <img 
//                 src={pack.imageUrl} 
//                 alt={pack.name} 
//                 className="pack-details__image"
//               />
//             )}
//           <PackProducts products={pack.products} />
//           </div>

//           <Typography variant="body1" className="pack-details__description">
//             {pack.description}
//           </Typography>




//           <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
//             <RentalPeriod
//               startDate={startDate}
//               endDate={endDate}
//               onStartDateChange={setStartDate}
//               onEndDateChange={setEndDate}
//               minStartDate={minStartDate}
//               minRentalDays={pack.minRentalDays}
//             />
//           </LocalizationProvider>

//           <QuantitySelector
//             quantity={quantity}
//             onChange={setQuantity}
//             minQuantity={pack.minQuantity}
//           />

//           <PriceCalculation
//             products={pack.products}
//             quantity={quantity}
//             startDate={startDate}
//             endDate={endDate}
//             discountPercentage={pack.discountPercentage}
//           />

//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             size="large"
//             onClick={handleAddToCart}
//             className="pack-details__add-to-cart"
//           >
//             Ajouter le pack au panier
//           </Button>
//         </Paper>
//       </Container>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailablePackStock } from '../../features/stockSlice';


import { Container, Typography, Paper, Button, Alert } from '@mui/material';
import RentalPeriod from '../ProductDetails/components/RentalPeriod';
import QuantitySelector from '../ProductDetails/components/QuantitySelector';
import PackProducts from './components/PackProducts';
import PriceCalculation from './components/PriceCalculation';
import { fetchPackById } from '../../services/packs.service';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { addDays } from 'date-fns';

import './PackDetails.scss';

export default function PackDetails() {
  const { packId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const dispatch = useDispatch();

  const [pack, setPack] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);

  const availableStock = useSelector((state) => state.stock.stockByPack[packId]);
  const stockLoading = useSelector((state) => state.stock.loading);

  useEffect(() => {
    async function loadPack() {
      try {
        setError(null);
        const packData = await fetchPackById(packId);
        setPack(packData);
        setQuantity(packData.minQuantity || 1);
      } catch {
        setError("Impossible de charger le pack.");
      }
    }
    loadPack();
  }, [packId]);

  useEffect(() => {
    if (packId && startDate && endDate) {
      console.log(`🔍 Vérification du stock pour le pack ${packId} du ${startDate} au ${endDate}`);
      dispatch(fetchAvailablePackStock({ packId, startDate, endDate }));
    }
  }, [packId, startDate, endDate, dispatch]);
  
  const isFormValid =
    pack &&
    startDate &&
    endDate &&
    quantity > 0 &&
    quantity <= availableStock &&
    !error;

  return (
    <Container className="pack-details">
      <Paper className="pack-details__content">
        <Typography variant="h4">{pack?.name}</Typography>

        {pack?.imageUrl && <img src={pack.imageUrl} alt={pack.name} className="pack-details__image" />}

        <PackProducts products={pack?.products || []} />

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <RentalPeriod startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} minStartDate={addDays(new Date(), 2)} />
        </LocalizationProvider>

        <Typography variant="body2" color="textSecondary">Stock maximal : {pack?.stock ?? "Chargement..."}</Typography>

        {startDate && endDate && (
          stockLoading ? (
            <Typography color="textSecondary" variant="body2">Chargement du stock...</Typography>
          ) : availableStock !== undefined ? (
            <Typography color="textSecondary" variant="body2">
              Stock disponible : <strong>{availableStock}</strong>
            </Typography>
          ) : null
        )}

        <QuantitySelector quantity={quantity} onChange={setQuantity} minQuantity={pack?.minQuantity} stock={availableStock} />

        {error && <Alert severity="error">{error}</Alert>}

        <PriceCalculation products={pack?.products || []} quantity={quantity} startDate={startDate} endDate={endDate} discountPercentage={pack?.discountPercentage} />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={() => addToCart({ ...pack, type: 'pack', quantity, startDate, endDate })}
          className="pack-details__add-to-cart"
          disabled={!isFormValid}
        >
          Ajouter le pack au panier
        </Button>
      </Paper>
    </Container>
  );
}

