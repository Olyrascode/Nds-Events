// import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
// import { getCollection, COLLECTIONS } from '../firebase/collections';

// export const addReservation = async (productId, reservation) => {
//   const productRef = doc(getCollection(COLLECTIONS.PRODUCTS), productId);
  
//   await updateDoc(productRef, {
//     reservations: arrayUnion({
//       ...reservation,
//       startDate: reservation.startDate.toISOString(),
//       endDate: reservation.endDate.toISOString()
//     })
//   });
// };

// export const createReservationsFromOrder = async (order) => {
//   const promises = order.products.map(product => 
//     addReservation(product.id, {
//       orderId: order.id,
//       quantity: product.quantity,
//       startDate: order.startDate,
//       endDate: order.endDate
//     })
//   );

//   await Promise.all(promises);
// };

import { API_URL } from '../config';

export const addReservation = async (productId, reservation) => {
  try {
    const response = await fetch(`${API_URL}/api/reservations/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, reservation }),
    });

    if (!response.ok) {
      throw new Error('Failed to add reservation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding reservation:', error);
    throw error;
  }
};

export const createReservationsFromOrder = async (order) => {
  try {
    const response = await fetch(`${API_URL}/api/reservations/create-from-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });

    if (!response.ok) {
      throw new Error('Failed to create reservations from order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating reservations from order:', error);
    throw error;
  }
};
