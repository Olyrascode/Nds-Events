// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
// import './ProductCard.scss';

// export default function ProductCard({ product, isPack = false }) {
//   const navigate = useNavigate();

//   const handleViewDetails = () => {
//     const path = isPack ? `/packs/${product.id}` : `/products/${product.id}`;
//     navigate(path);
//   };

//   return (
//     <Card className="product-card">
//       <CardMedia
//         component="img"
//         height="200"
//         image={product.imageUrl}
//         alt={product.title}
//         className="product-card__image"
//       />
//       <CardContent className="product-card__content">
//         <Typography gutterBottom variant="h5" component="h2">
//           {product.title || product.name}
//         </Typography>
//         <Typography variant="body2" color="text.secondary" className="product-card__description">
//           {product.description}
//         </Typography>
        
//         <Box sx={{ mt: 2 }}>
//           <Typography variant="h6" component="p" className="product-card__price">
//             €{product.price}/Jour
//           </Typography>
//           {isPack && (
//             <Chip
//               label={`${product.discountPercentage}% off`}
//               color="primary"
//               size="small"
//               className="product-card__discount"
//             />
//           )}
//           <Typography variant="body2" color="text.secondary">
//             Min. quantité: {product.minQuantity}
//           </Typography>
//         </Box>
        
//         <Button
//           variant="contained"
//           fullWidth
//           onClick={handleViewDetails}
//           className="product-card__button"
//           sx={{ mt: 2 }}
//         >
//           Voir le  {isPack ? 'Pack' : 'Produit'}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import './ProductCard.scss';

// Importer API_URL depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


export default function ProductCard({ product, isPack = false }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    const path = isPack ? `/packs/${product._id}` : `/products/${product._id}`;
    navigate(path);
  };

  // Générer l'URL de l'image en utilisant API_URL et product.imageFileName
  const imageUrl = product.imageUrl || '/default-placeholder.png';


  return (
    <Card className="product-card">
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={product.title}
        className="product-card__image"
      />
      <CardContent className="product-card__content">
        <Typography gutterBottom variant="h5" component="h2">
          {product.title || product.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" className="product-card__description">
          {product.description}
        </Typography>
        
        {/* Condition pour cacher le prix et la quantité minimale si c'est un pack */}
        {!isPack && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="p" className="product-card__price">
              €{product.price}/Jour
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Min. quantité: {product.minQuantity}
            </Typography>
          </Box>
        )}

        {/* Affichage de la promotion uniquement pour les packs */}
        {isPack && product.discountPercentage > 0 && (
          <Chip
            label={`${product.discountPercentage}% off`}
            color="primary"
            size="small"
            className="product-card__discount"
          />
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleViewDetails}
          className="product-card__button"
          sx={{ mt: 2 }}
        >
          Voir le {isPack ? 'Pack' : 'Produit'}
        </Button>
      </CardContent>
    </Card>
  );
}
