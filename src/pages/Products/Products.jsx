import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import ProductCard from '../../components/ProductCard/ProductCard';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import RentalDialog from '../../components/RentalDialog';
import './_Products.scss';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Exclure les produits de la catégorie "tentes"
      const filteredProducts = productsData.filter(product => product.category !== 'Tentes');
      setProducts(filteredProducts);

      // Extraire les catégories uniques (sans "tentes")
      const uniqueCategories = [...new Set(filteredProducts.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleRentClick = (product) => {
    setSelectedProduct(product);
    setOpenRentalDialog(true);
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="products">
      <Container>
        <div className="products__header">
          <Typography variant="h4" component="h1" className="products__title">
          Nos produits
          </Typography>
        </div>
        
        <div className="products__filters">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="products__grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onRent={handleRentClick}
            />
          ))}
        </div>

        {selectedProduct && (
          <RentalDialog
            open={openRentalDialog}
            onClose={() => setOpenRentalDialog(false)}
            product={selectedProduct}
          />
        )}
      </Container>
    </div>
  );
}