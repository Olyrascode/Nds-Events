import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailableStock } from '../../features/stockSlice';
import { useCart } from '../../contexts/CartContext';
import { fetchProductById } from '../../services/products.service';
import { isProductAvailable, calculateRentalDays } from '../../utils/dateUtils';
import { addDays } from 'date-fns';
import { Typography, Container } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';

import ProductOptions from './components/ProductOptions';
import RentalPeriod from './components/RentalPeriod';
import QuantitySelector from './components/QuantitySelector';
import PriceCalculation from './components/PriceCalculation';

import './ProductDetails.scss';

export default function ProductDetails() {
  const { productId } = useParams();
  const { addToCart, setIsCartOpen } = useCart();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [quantityError, setQuantityError] = useState("");

  const availableStock = useSelector((state) => state.stock.stockByProduct[productId]);
  const stockLoading = useSelector((state) => state.stock.loading);

  useEffect(() => {
    async function loadProduct() {
      try {
        setError(null);
        const productData = await fetchProductById(productId);
        setProduct(productData);
        setQuantity(productData.minQuantity || 1);
      } catch {
        setError("Impossible de charger le produit.");
      }
    }
    loadProduct();
  }, [productId]);

  useEffect(() => {
    if (productId && startDate && endDate) {
      console.log(`🔍 Vérification du stock pour ${productId} du ${startDate} au ${endDate}`);
      dispatch(fetchAvailableStock({ productId, startDate, endDate }));
    }
  }, [productId, startDate, endDate, dispatch]);
  

  useEffect(() => {
    if (!product) return;

    const days = calculateRentalDays(startDate, endDate);
    const extraOptionsPrice = Object.values(selectedOptions).reduce((acc, opt) => acc + opt.price, 0);
    const dailyUnitPrice = product.price + extraOptionsPrice;

    let basePrice = dailyUnitPrice * quantity;
    if (days > 4) basePrice += 0.15 * basePrice * (days - 4);

    setFinalPrice(basePrice);
  }, [product, selectedOptions, quantity, startDate, endDate]);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    setQuantityError(isProductAvailable(product, startDate, endDate, newQuantity) ? "" : "Stock insuffisant.");
  };

  const handleAddToCart = () => {
    if (!isProductAvailable(product, startDate, endDate, quantity)) {
      setError("Produit indisponible pour ces dates.");
      return;
    }

    addToCart({ ...product, selectedOptions, price: finalPrice, quantity, startDate, endDate });
    setIsCartOpen(true);
  };

  if (!product) return <div className="product-details__error">{error || "Produit introuvable."}</div>;

  return (
    <Container className="product-details">
      <Typography variant="h4">{product.title}</Typography>

      {product.imageUrl && <img src={product.imageUrl} alt={product.title} className="product-details__image" />}

      {product.options?.length > 0 ? (
        <ProductOptions options={product.options} selectedOptions={selectedOptions} onChange={setSelectedOptions} />
      ) : (
        <Typography variant="h6">€{product.price} par jour</Typography>
      )}

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <RentalPeriod startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} minStartDate={addDays(new Date(), 2)} />
      </LocalizationProvider>

      // ✅ Affichage du stock disponible
{stockLoading ? (
  <Typography color="textSecondary" variant="body2">Chargement du stock...</Typography>
) : availableStock !== undefined ? (
  <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
    Stock disponible : <strong>{availableStock}</strong>
  </Typography>
) : null}

      <QuantitySelector quantity={quantity} onChange={handleQuantityChange} minQuantity={product.minQuantity} stock={product.stock} />

      {quantityError && <Typography color="error" variant="body2">{quantityError}</Typography>}

      <PriceCalculation price={product.price} quantity={quantity} startDate={startDate} endDate={endDate} selectedOptions={selectedOptions} />

      <Typography variant="h6"><strong>Total : {finalPrice.toFixed(2)}€</strong></Typography>

      <button className="product-details__add-to-cart" onClick={handleAddToCart}>Ajouter au panier</button>
    </Container>
  );
}
