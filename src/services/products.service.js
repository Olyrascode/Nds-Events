const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Créer un produit
export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('minQuantity', productData.minQuantity);
    formData.append('category', productData.category);
    formData.append('stock', productData.stock || 0);
    formData.append('options', JSON.stringify(productData.options || []));
    if (productData.image) {
      formData.append('image', productData.image);
    }

    console.log('FormData content:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Récupérer un produit par ID
// export const fetchProductById = async (productId) => {
//   try {
//     const response = await fetch(`${API_URL}/api/products/${productId}`);

//     if (!response.ok) {
//       throw new Error('Product not found');
//     }

//     const product = await response.json();
//     return product;
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     throw error;
//   }
// };
export const fetchProductById = async (productId) => {
  const response = await fetch(`${API_URL}/api/products/${productId}`);
  if (!response.ok) {
    throw new Error('Product not found');
  }
  const product = await response.json();

  // Normaliser
  return {
    ...product,
    id: product._id,
  };
};


// Mettre à jour un produit
export const updateProduct = async (productId, productData) => {
  try {
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('minQuantity', productData.minQuantity);
    formData.append('category', productData.category);
    formData.append('stock', productData.stock || 0);
    formData.append('options', JSON.stringify(productData.options || []));
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    const updatedProduct = await response.json();
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Supprimer un produit
export const deleteProduct = async (productId) => {
  try {
    // Assure-toi que productId est défini et correct
    if (!productId) {
      throw new Error('Product ID is undefined');
    }

    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};


// Récupérer tous les produits
// export const fetchProducts = async () => {
//   try {
//     const response = await fetch(`${API_URL}/api/products`);

//     if (!response.ok) {
//       throw new Error('Failed to fetch products');
//     }

//     const products = await response.json();
//     return products;
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     throw error;
//   }
// };
export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const products = await response.json();

  // Transforme _id en id pour que tout votre front utilise .id
  const normalized = products.map(prod => ({
    ...prod,
    id: prod._id,         // on crée un champ id
  }));

  return normalized;
};

