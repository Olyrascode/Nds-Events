import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../services/orders.service';
import OrderSummary from '../components/checkout/OrderSummary';
import DeliveryOptions from '../components/checkout/DeliveryOptions';
import ShippingForm from '../components/checkout/ShippingForm';
import BillingForm from '../components/checkout/BillingForm';
import PaymentForm from '../components/checkout/PaymentForm';
import { calculateOrderTotal } from '../utils/priceUtils';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Alert,
  Divider
} from '@mui/material';

const steps = ['Review Order', 'Billing & Shipping', 'Payment'];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    zipCode: ''
  });
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [error, setError] = useState('');
  
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const validateBillingInfo = () => {
    return Object.values(billingInfo).every(value => value.trim() !== '');
  };

  const validateShippingInfo = () => {
    if (deliveryMethod === 'pickup') return true;
    return Object.values(shippingInfo).every(value => value.trim() !== '');
  };

  const handleNext = () => {
    setError('');

    if (activeStep === 0) {
      if (deliveryMethod === 'delivery' && !validateShippingInfo()) {
        setError('Please fill in all shipping information');
        return;
      }
    } else if (activeStep === 1) {
      if (!validateBillingInfo()) {
        setError('Please fill in all billing information');
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    console.log('🟡 currentUser:', currentUser); // Vérifie si currentUser existe
  
    try {
      if (!currentUser || !(currentUser._id || currentUser.id)) {
        setError("Utilisateur non authentifié");
        return;
      }
      const userId = currentUser._id || currentUser.id; 

      const { total } = calculateOrderTotal(cart, cart[0].startDate, cart[0].endDate, deliveryMethod);
  
      const order = await createOrder({
        userId: userId,  // 🔥 Assure-toi d'utiliser `_id`
        customerEmail: currentUser.email,
        products: cart,
        deliveryMethod,
        shippingInfo: deliveryMethod === 'delivery' ? shippingInfo : null,
        billingInfo,
        startDate: new Date(cart[0].startDate),
        endDate: new Date(cart[0].endDate),
        total,
        paymentIntentId: paymentIntent.id,
        status: 'confirmé',
        createdAt: new Date()
      });
  
      clearCart();
      navigate('/order-confirmation', { state: { order } });
    } catch (error) {
      setError('Échec de création de commande, veuillez réessayer.');
      console.error('🔴 Erreur création commande:', error);
    }
  };
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <OrderSummary
              cart={cart}
              startDate={cart[0].startDate}
              endDate={cart[0].endDate}
              deliveryMethod={deliveryMethod}
            />
            <DeliveryOptions
              value={deliveryMethod}
              onChange={setDeliveryMethod}
            />
            {deliveryMethod === 'Livraison' && (
              <ShippingForm
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
              />
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <BillingForm
              billingInfo={billingInfo}
              setBillingInfo={setBillingInfo}
            />
            <Divider sx={{ my: 3 }} />
            <OrderSummary
              cart={cart}
              startDate={cart[0].startDate}
              endDate={cart[0].endDate}
              deliveryMethod={deliveryMethod}
            />
          </Box>
        );
      case 2:
        const { total } = calculateOrderTotal(
          cart,
          cart[0].startDate,
          cart[0].endDate,
          deliveryMethod
        );
        return (
          <Box>
            <OrderSummary
              cart={cart}
              startDate={cart[0].startDate}
              endDate={cart[0].endDate}
              deliveryMethod={deliveryMethod}
            />
            <PaymentForm
              amount={Math.round(total * 100)}
              onSuccess={handlePaymentSuccess}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (!cart.length) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <Alert severity="info">
          Votre panier est vide. Ajoutez des produits avec de procéder au paiement.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Précédent
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button variant="contained" onClick={handleNext}>
              Suivant
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}