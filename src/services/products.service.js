import { 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  getDocs,
  getDoc 
} from 'firebase/firestore';
import { getCollection, COLLECTIONS } from '../firebase/collections';
import { uploadProductImage, deleteProductImage } from './storage.service';


export const createProduct = async (productData) => {
  try {
    let imageUrl = '';
    if (productData.image) {
      imageUrl = await uploadProductImage(productData.image);
    }

    const product = {
      title: productData.title,
      description: productData.description,
      price: parseFloat(productData.price),
      minQuantity: parseInt(productData.minQuantity),
      category: productData.category,
      stock: parseInt(productData.stock || 0),
      options: productData.options || [],
      imageUrl,
      createdAt: new Date()
    };

    const docRef = await addDoc(getCollection(COLLECTIONS.PRODUCTS), product);
    return {
      id: docRef.id,
      ...product
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const fetchProductById = async (productId) => {
  try {
    const productRef = doc(getCollection(COLLECTIONS.PRODUCTS), productId);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error('Product not found');
    }

    return {
      id: productDoc.id,
      ...productDoc.data()
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(getCollection(COLLECTIONS.PRODUCTS), productId);
    
    let imageUrl = productData.imageUrl;
    if (productData.image) {
      if (productData.imageUrl) {
        await deleteProductImage(productData.imageUrl);
      }
      imageUrl = await uploadProductImage(productData.image);
    }

    const updatedProduct = {
      ...productData,
      price: parseFloat(productData.price),
      minQuantity: parseInt(productData.minQuantity),
      stock: parseInt(productData.stock || 0),
      imageUrl,
      updatedAt: new Date()
    };

    await updateDoc(productRef, updatedProduct);
    return { id: productId, ...updatedProduct };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(getCollection(COLLECTIONS.PRODUCTS), productId);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error('Product not found');
    }

    const productData = productDoc.data();
    
    if (productData.imageUrl) {
      await deleteProductImage(productData.imageUrl);
    }
    
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(getCollection(COLLECTIONS.PRODUCTS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};