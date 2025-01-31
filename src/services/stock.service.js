// import { doc, updateDoc, getDoc } from 'firebase/firestore';
// import { getCollection, COLLECTIONS } from '../firebase/collections';

// export const updateProductStock = async (productId, quantity, operation = 'decrease') => {
//   const productRef = doc(getCollection(COLLECTIONS.PRODUCTS), productId);
//   const productDoc = await getDoc(productRef);
  
//   if (!productDoc.exists()) {
//     throw new Error('Product not found');
//   }

//   const currentStock = productDoc.data().stock;
//   const newStock = operation === 'decrease' ? currentStock - quantity : currentStock + quantity;

//   await updateDoc(productRef, { stock: newStock });
//   return newStock;
// };

// export const getAvailableStock = async (productId, startDate, endDate) => {
//   const productRef = doc(getCollection(COLLECTIONS.PRODUCTS), productId);
//   const productDoc = await getDoc(productRef);
  
//   if (!productDoc.exists()) {
//     throw new Error('Product not found');
//   }

//   const product = productDoc.data();
//   const baseStock = product.stock;
//   const reservations = product.reservations || [];

//   // Find overlapping reservations for the selected dates
//   const overlappingReservations = reservations.filter(reservation => {
//     const reservationStart = new Date(reservation.startDate);
//     const reservationEnd = new Date(reservation.endDate);
//     const requestStart = new Date(startDate);
//     const requestEnd = new Date(endDate);

//     return !(requestEnd < reservationStart || requestStart > reservationEnd);
//   });

//   // Calculate maximum reserved quantity for the period
//   const reservedQuantity = overlappingReservations.reduce((total, reservation) => {
//     return Math.max(total, reservation.quantity);
//   }, 0);

//   return baseStock - reservedQuantity;
// };

import { API_URL } from '../config';

export const updateProductStock = async (productId, quantity, operation = 'decrease') => {
  try {
    const response = await fetch(`${API_URL}/api/stock/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, operation }),
    });

    if (!response.ok) {
      throw new Error('Failed to update stock');
    }

    const data = await response.json();
    return data.newStock;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export const getAvailableStock = async (productId, startDate, endDate) => {
  try {
    console.log(`📡 Requête API : Stock pour ${productId} du ${startDate} au ${endDate}`);
    const response = await fetch(`${API_URL}/api/stock/available?productId=${productId}&startDate=${startDate}&endDate=${endDate}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch available stock');
    }

    const data = await response.json();
    return data.availableStock;
  } catch (error) {
    console.error('❌ Erreur récupération stock:', error);
    throw error;
  }
};
