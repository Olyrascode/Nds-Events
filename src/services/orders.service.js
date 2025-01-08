import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const fetchOrdersForMonth = async (startDate, endDate) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('startDate', '>=', Timestamp.fromDate(startDate)),
      where('startDate', '<=', Timestamp.fromDate(endDate))
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    // Convert dates to Firestore Timestamps
    const order = {
      ...orderData,
      startDate: Timestamp.fromDate(new Date(orderData.startDate)),
      endDate: Timestamp.fromDate(new Date(orderData.endDate)),
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'orders'), order);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

