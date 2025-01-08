import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getCollection, COLLECTIONS } from '../firebase/collections';

export const addReservation = async (productId, reservation) => {
  const productRef = doc(getCollection(COLLECTIONS.PRODUCTS), productId);
  
  await updateDoc(productRef, {
    reservations: arrayUnion({
      ...reservation,
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString()
    })
  });
};

export const createReservationsFromOrder = async (order) => {
  const promises = order.products.map(product => 
    addReservation(product.id, {
      orderId: order.id,
      quantity: product.quantity,
      startDate: order.startDate,
      endDate: order.endDate
    })
  );

  await Promise.all(promises);
};