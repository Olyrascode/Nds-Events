import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getCollection, COLLECTIONS } from '../firebase/collections';

export const updateProductStock = async (productId, quantity, operation = 'decrease') => {
  const productRef = doc(getCollection(COLLECTIONS.PRODUCTS), productId);
  const productDoc = await getDoc(productRef);
  
  if (!productDoc.exists()) {
    throw new Error('Product not found');
  }

  const currentStock = productDoc.data().stock;
  const newStock = operation === 'decrease' ? currentStock - quantity : currentStock + quantity;

  await updateDoc(productRef, { stock: newStock });
  return newStock;
};

export const getAvailableStock = async (productId, startDate, endDate) => {
  const productRef = doc(getCollection(COLLECTIONS.PRODUCTS), productId);
  const productDoc = await getDoc(productRef);
  
  if (!productDoc.exists()) {
    throw new Error('Product not found');
  }

  const product = productDoc.data();
  const baseStock = product.stock;
  const reservations = product.reservations || [];

  // Find overlapping reservations for the selected dates
  const overlappingReservations = reservations.filter(reservation => {
    const reservationStart = new Date(reservation.startDate);
    const reservationEnd = new Date(reservation.endDate);
    const requestStart = new Date(startDate);
    const requestEnd = new Date(endDate);

    return !(requestEnd < reservationStart || requestStart > reservationEnd);
  });

  // Calculate maximum reserved quantity for the period
  const reservedQuantity = overlappingReservations.reduce((total, reservation) => {
    return Math.max(total, reservation.quantity);
  }, 0);

  return baseStock - reservedQuantity;
};