// import { 
//   collection, 
//   query, 
//   where, 
//   getDocs, 
//   addDoc,
//   Timestamp 
// } from 'firebase/firestore';
// import { db } from '../firebase/config';

// export const fetchOrdersForMonth = async (startDate, endDate) => {
//   try {
//     const ordersRef = collection(db, 'orders');
//     const q = query(
//       ordersRef,
//       where('startDate', '>=', Timestamp.fromDate(startDate)),
//       where('startDate', '<=', Timestamp.fromDate(endDate))
//     );

//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     throw error;
//   }
// };

// export const createOrder = async (orderData) => {
//   try {
//     // Convert dates to Firestore Timestamps
//     const order = {
//       ...orderData,
//       startDate: Timestamp.fromDate(new Date(orderData.startDate)),
//       endDate: Timestamp.fromDate(new Date(orderData.endDate)),
//       createdAt: Timestamp.now()
//     };

//     const docRef = await addDoc(collection(db, 'orders'), order);
//     return docRef.id;
//   } catch (error) {
//     console.error('Error creating order:', error);
//     throw error;
//   }
// };

// export const fetchUserOrders = async (userId) => {
//   try {
//     const ordersRef = collection(db, 'orders');
//     const q = query(ordersRef, where('userId', '==', userId));
//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//   } catch (error) {
//     console.error('Error fetching user orders:', error);
//     throw error;
//   }
// };

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 📌 Créer une commande
export const createOrder = async (orderData) => {
  try {
    console.log('🟡 Envoi de la commande:', orderData); 
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) throw new Error('Erreur lors de la création de la commande');

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('🔴Erreur création commande:', error);
    throw error;
  }
};

// 📌 Récupérer les commandes d'un utilisateur
export const fetchUserOrders = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/orders/user/${userId}`);
    if (!response.ok) throw new Error('Erreur récupération commandes');

    const data = await response.json();
    return data.orders;
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    throw error;
  }
};

export const fetchOrdersForMonth = async (startDate, endDate) => {
  try {
    const response = await fetch(`${API_URL}/api/orders`);
    if (!response.ok) throw new Error('Erreur récupération commandes');

    const data = await response.json();
    return data.orders.filter(order => {
      const orderDate = new Date(order.startDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    throw error;
  }
};
// Récupérer toutes les commandes
export const fetchAllOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/api/orders`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des commandes");
    }
    const data = await response.json();
    return data.orders; // Retourne les commandes
  } catch (error) {
    console.error("Erreur fetchAllOrders:", error);
    throw error;
  }
};

// Supprimer une commande
export const deleteOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de la commande");
    }

    return true; // Confirme la suppression
  } catch (error) {
    console.error("Erreur deleteOrder:", error);
    throw error;
  }
};