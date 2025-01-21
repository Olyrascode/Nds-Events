import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import ProductOptions from './components/ProductOptions';
import RentalPeriod from './components/RentalPeriod';
import QuantitySelector from './components/QuantitySelector';
import PriceCalculation from './components/PriceCalculation';
import { fetchProductById } from '../../services/products.service';
import { isProductAvailable } from '../../utils/dateUtils';
import { calculateRentalDays } from '../../utils/dateUtils';
import { addDays } from 'date-fns';
import './ProductDetails.scss';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [finalPrice, setFinalPrice] = useState(0); // Stockage du prix total final

  useEffect(() => {
    loadProduct();
  }, [productId]);

  useEffect(() => {
    // Recalcul du prix uniquement sur la page produit
    const days = calculateRentalDays(startDate, endDate);
    const basePrice = product?.price * quantity || 0;
    let calculatedPrice = basePrice;

    if (days > 4) {
      const extraDays = days - 4;
      calculatedPrice = basePrice + (0.15 * basePrice * extraDays);
    }

    setFinalPrice(calculatedPrice);
  }, [selectedOptions, quantity, startDate, endDate, product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await fetchProductById(productId);
      setProduct(productData);
      setQuantity(productData.minQuantity || 1);
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const minStartDate = addDays(today, 2); // Bloque les 2 jours suivants la date actuelle


  const handleAddToCart = () => {
    try {
      if (!isProductAvailable(product, startDate, endDate, quantity)) {
        setError('Product is not available for the selected dates and quantity');
        return;
      }

      // Le prix total est transmis directement au panier
      addToCart({
        ...product,
        selectedOptions,
        price: finalPrice,  // Envoi du prix total déjà calculé
        quantity,
        startDate,
        endDate
      });

      navigate('/cart');
    } catch (error) {
      setError(error.message || 'Failed to add product to cart');
    }
  };

  if (loading) return <div className="product-details__loading">Chargement...</div>;
  if (error) return <div className="product-details__error">{error}</div>;
  if (!product) return <div className="product-details__error">Produit introuvable</div>;

  return (
    <div className="product-details">
      <div className="product-details__content">
        <h1 className="product-details__title">{product.title}</h1>
        
        {product.imageUrl && (
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="product-details__image"
          />
        )}

        {product.options && product.options.length > 0 ? (
          <ProductOptions
            options={product.options}
            selectedOptions={selectedOptions}
            onChange={setSelectedOptions}
          />
        ) : (
          <p className="product-details__price">€{product.price} par jour</p>
        )}

<RentalPeriod
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          minStartDate={minStartDate} // Transmettre minStartDate ici
        />

        <QuantitySelector
          quantity={quantity}
          onChange={setQuantity}
          minQuantity={product.minQuantity}
          stock={product.stock}
        />

        <PriceCalculation
          price={product.price}
          quantity={quantity}
          startDate={startDate}
          endDate={endDate}
        />

        <p><strong>Total Calculé: {finalPrice.toFixed(2)}€</strong></p>

        <button
          className="product-details__add-to-cart"
          onClick={handleAddToCart}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
