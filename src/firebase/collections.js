import { collection } from 'firebase/firestore';
import { db } from './config';

export const COLLECTIONS = {
  PRODUCTS: 'products',
  PACKS: 'packs',
  ORDERS: 'orders',
  USERS: 'users',
};

export const getCollection = (collectionName) => collection(db, collectionName);