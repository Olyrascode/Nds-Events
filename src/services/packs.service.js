import { 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  updateDoc 
} from 'firebase/firestore';
import { getCollection, COLLECTIONS } from '../firebase/collections';
import { uploadProductImage, deleteProductImage } from './storage.service';

export const createPack = async (packData) => {
  try {
    let imageUrl = '';
    if (packData.image) {
      imageUrl = await uploadProductImage(packData.image);
    }

    const pack = {
      name: packData.name,
      description: packData.description,
      products: packData.products.map(product => ({
        id: product.id,
        quantity: product.quantity
      })),
      discountPercentage: parseFloat(packData.discountPercentage),
      minRentalDays: parseInt(packData.minRentalDays),
      imageUrl,
      createdAt: new Date()
    };

    const docRef = await addDoc(getCollection(COLLECTIONS.PACKS), pack);
    return {
      id: docRef.id,
      ...pack
    };
  } catch (error) {
    console.error('Error creating pack:', error);
    throw error;
  }
};

export const fetchPackById = async (packId) => {
  try {
    const packRef = doc(getCollection(COLLECTIONS.PACKS), packId);
    const packDoc = await getDoc(packRef);
    
    if (!packDoc.exists()) {
      throw new Error('Pack not found');
    }

    // Get the pack data
    const packData = {
      id: packDoc.id,
      ...packDoc.data()
    };

    // Fetch full product details for each product in the pack
    const productsWithDetails = await Promise.all(
      packData.products.map(async (product) => {
        const productRef = doc(getCollection(COLLECTIONS.PRODUCTS), product.id);
        const productDoc = await getDoc(productRef);
        if (!productDoc.exists()) {
          throw new Error(`Product ${product.id} not found`);
        }
        return {
          ...productDoc.data(),
          id: product.id,
          quantity: product.quantity
        };
      })
    );

    return {
      ...packData,
      products: productsWithDetails
    };
  } catch (error) {
    console.error('Error fetching pack:', error);
    throw error;
  }
};

export const updatePack = async (packId, packData) => {
  try {
    const packRef = doc(getCollection(COLLECTIONS.PACKS), packId);
    
    let imageUrl = packData.imageUrl;
    if (packData.image) {
      if (packData.imageUrl) {
        await deleteProductImage(packData.imageUrl);
      }
      imageUrl = await uploadProductImage(packData.image);
    }

    const updatedPack = {
      ...packData,
      products: packData.products.map(product => ({
        id: product.id,
        quantity: product.quantity
      })),
      discountPercentage: parseFloat(packData.discountPercentage),
      minRentalDays: parseInt(packData.minRentalDays),
      imageUrl,
      updatedAt: new Date()
    };

    await updateDoc(packRef, updatedPack);
    return { id: packId, ...updatedPack };
  } catch (error) {
    console.error('Error updating pack:', error);
    throw error;
  }
};

export const deletePack = async (packId) => {
  try {
    const packRef = doc(getCollection(COLLECTIONS.PACKS), packId);
    const packDoc = await getDoc(packRef);
    
    if (!packDoc.exists()) {
      throw new Error('Pack not found');
    }

    const packData = packDoc.data();
    
    if (packData.imageUrl) {
      await deleteProductImage(packData.imageUrl);
    }
    
    await deleteDoc(packRef);
    return true;
  } catch (error) {
    console.error('Error deleting pack:', error);
    throw error;
  }
};

export const fetchPacks = async () => {
  try {
    const querySnapshot = await getDocs(getCollection(COLLECTIONS.PACKS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching packs:', error);
    throw error;
  }
};