import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { isProductAvailable } from '../utils/dateUtils';
import { addDays } from 'date-fns';

export default function RentalDialog({ open, onClose, product }) {
  const { addToCart } = useCart();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [quantity, setQuantity] = useState(product.minQuantity);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    if (quantity < product.minQuantity) {
      setError(`Minimum quantity required is ${product.minQuantity}`);
      return;
    }

    if (!isProductAvailable(product, startDate, endDate, quantity)) {
      setError('Product is not available for the selected dates and quantity');
      return;
    }

    addToCart(product, quantity, startDate, endDate);
    onClose();
  };

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate);
    if (endDate <= newDate) {
      setEndDate(addDays(newDate, 1));
    }
    setError('');
  };

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate);
    setError('');
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rent {product.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              minDate={new Date()}
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              minDate={addDays(startDate, 1)}
              slotProps={{
                textField: { fullWidth: true }
              }}
            />
          </LocalizationProvider>

          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{ 
              min: product.minQuantity,
              step: 1
            }}
            helperText={`Minimum quantity: ${product.minQuantity}`}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
}