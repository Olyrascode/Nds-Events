import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Container, Typography, Paper, Box, Button, Alert } from '@mui/material';
import RentalPeriod from '../ProductDetails/components/RentalPeriod';
import QuantitySelector from '../ProductDetails/components/QuantitySelector';
import PackProducts from './components/PackProducts';
import PriceCalculation from './components/PriceCalculation';
import { fetchPackById } from '../../services/packs.service';
import { isPackAvailable } from '../../utils/dateUtils';
import './PackDetails.scss';

export default function PackDetails() {
  const { packId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    loadPack();
  }, [packId]);

  const loadPack = async () => {
    try {
      setLoading(true);
      setError(null);
      const packData = await fetchPackById(packId);
      setPack(packData);
      setQuantity(packData.minQuantity || 1);
    } catch (err) {
      setError('Failed to load pack details');
      console.error('Error loading pack:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isPackAvailable(pack, startDate, endDate, quantity)) {
      setError("Le pack n'est pas disponnible pour les dates selectionées ou les quantités");
      return;
    }

    const rentalDays = calculateRentalDays(startDate, endDate);
    if (rentalDays < pack.minRentalDays) {
      setError(`Le minimum de jour de location pour ce pack est de  ${pack.minRentalDays} jours`);
      return;
    }

    addToCart({
      ...pack,
      type: 'pack',
      quantity,
      startDate,
      endDate
    });
    navigate('/cart');
  };

  if (loading) return <div className="pack-details__loading">Loading...</div>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!pack) return <Alert severity="error">Pack introuvable</Alert>;

  return (
    <div className="pack-details">
      <Container>
        <Paper className="pack-details__content">
          <div className="pack-details__header">
            <Typography variant="h1" className="pack-details__title">
              {pack.name}
            </Typography>
            {pack.imageUrl && (
              <img 
                src={pack.imageUrl} 
                alt={pack.name} 
                className="pack-details__image"
              />
            )}
          </div>

          <Typography variant="body1" className="pack-details__description">
            {pack.description}
          </Typography>

          <Typography variant="h6" className="pack-details__discount">
            {pack.discountPercentage}% Promotion appliquée
          </Typography>

          <PackProducts products={pack.products} />

          <RentalPeriod
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            minStartDate={new Date()}
            minRentalDays={pack.minRentalDays}
          />

          <QuantitySelector
            quantity={quantity}
            onChange={setQuantity}
            minQuantity={pack.minQuantity}
          />

          <PriceCalculation
            products={pack.products}
            quantity={quantity}
            startDate={startDate}
            endDate={endDate}
            discountPercentage={pack.discountPercentage}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleAddToCart}
            className="pack-details__add-to-cart"
          >
            Add Pack to Cart
          </Button>
        </Paper>
      </Container>
    </div>
  );
}