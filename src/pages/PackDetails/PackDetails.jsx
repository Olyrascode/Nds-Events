import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useDispatch } from 'react-redux';
import { fetchPackById } from '../../services/packs.service';

import { Container, Typography, Paper, Button, Alert } from '@mui/material';
import RentalPeriod from '../ProductDetails/components/RentalPeriod';
import QuantitySelector from '../ProductDetails/components/QuantitySelector';
import PackProducts from './components/PackProducts';
import PriceCalculation from './components/PriceCalculation';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { addDays } from 'date-fns';

import './PackDetails.scss';

export default function PackDetails() {
  const { packId } = useParams();
  const { addToCart } = useCart();
  const dispatch = useDispatch();

  const [pack, setPack] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [productStockAvailability, setProductStockAvailability] = useState({});
  const [maxPackQuantity, setMaxPackQuantity] = useState(null);

  // ✅ Charger les infos du pack
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

  // ✅ Récupérer le stock des produits inclus dans le pack
// Dans votre useEffect de PackDetails.jsx :
useEffect(() => {
  async function fetchStockForPackProducts() {
    if (!pack || !startDate || !endDate) return;

    const productStockPromises = pack.products.map(async (packItem) => {
      if (!packItem.product || !packItem.product._id) {
        console.error(`Produit invalide dans le pack :`, packItem);
        return { productId: null, availableStock: 0 };
      }

      try {
        const productId = packItem.product._id;
        // Convertir les dates au format ISO et les encoder
        const startDateStr = encodeURIComponent(startDate.toISOString());
        const endDateStr = encodeURIComponent(endDate.toISOString());
        // Désactiver le cache pour éviter les réponses 304
        const response = await fetch(
          `/api/stock/${productId}?startDate=${startDateStr}&endDate=${endDateStr}`,
          { cache: 'no-store' }
        );

        if (!response.ok) {
          throw new Error(`Erreur récupération stock pour ${packItem.product.title}`);
        }

        const data = await response.json();
        return { productId, availableStock: data.availableStock };
      } catch (error) {
        console.error(`Erreur récupération stock produit ${packItem.product.title}:`, error);
        return { productId: null, availableStock: 0 };
      }
    });

    const stockResults = await Promise.all(productStockPromises);
    const stockMap = stockResults.reduce((acc, item) => {
      if (item.productId) acc[item.productId] = item.availableStock;
      return acc;
    }, {});

    setProductStockAvailability(stockMap);

    // Calcul du nombre maximal de packs disponibles
    if (pack?.products) {
      const maxPossiblePacks = pack.products.map((packItem) => {
        const availableStock = stockMap[packItem.product._id] || 0;
        return Math.floor(availableStock / packItem.quantity);
      });

      setMaxPackQuantity(Math.min(...maxPossiblePacks));
    }
  }

  fetchStockForPackProducts();
}, [pack, startDate, endDate]);


  
  

  // ✅ Vérification des conditions avant d'ajouter au panier
  const isFormValid = pack && startDate && endDate && quantity > 0 && quantity <= maxPackQuantity && !error;

  return (
    <Container className="pack-details">
      <Paper className="pack-details__content">
        <Typography variant="h4">{pack?.name}</Typography>

        {pack?.imageUrl && <img src={pack.imageUrl} alt={pack.name} className="pack-details__image" />}

        <PackProducts products={pack?.products || []} />

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <RentalPeriod
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            minStartDate={addDays(new Date(), 2)}
          />
        </LocalizationProvider>

        <Typography variant="body2" color="textSecondary">
          Nombre maximal de packs disponibles : {maxPackQuantity !== null ? maxPackQuantity : "Chargement..."}
        </Typography>

        <Paper className="pack-details__product-stock">
  <Typography variant="h6">Stock des produits du pack</Typography>
  {pack?.products.map((packItem) => {
  const product = packItem.product;
  const productId = product?._id;
  // Utilisation de "title" au lieu de "name"
  const productName = product?.title || "Produit inconnu";

  return productId ? (
    <Typography key={productId} variant="body2" color="textSecondary">
      {productName}: {productStockAvailability[productId] !== undefined
        ? `${productStockAvailability[productId]} disponibles`
        : "Chargement..."}
    </Typography>
  ) : (
    <Typography key={Math.random()} variant="body2" color="error">
      Produit invalide : Données manquantes
    </Typography>
  );
})}

</Paper>




        <QuantitySelector quantity={quantity} onChange={setQuantity} minQuantity={pack?.minQuantity} stock={maxPackQuantity} />

        {error && <Alert severity="error">{error}</Alert>}

        <PriceCalculation
          products={pack?.products || []}
          quantity={quantity}
          startDate={startDate}
          endDate={endDate}
          discountPercentage={pack?.discountPercentage}
          setFinalPrice={setFinalPrice}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={() => addToCart({ ...pack, type: 'pack', quantity, startDate, endDate, price: finalPrice })}
          className="pack-details__add-to-cart"
          disabled={!isFormValid}
        >
          Ajouter le pack au panier
        </Button>
      </Paper>
    </Container>
  );
}
