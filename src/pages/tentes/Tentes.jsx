// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Typography, Grid } from '@mui/material';
// import "./_Tentes.scss";


// import ProductCard from '../../components/ProductCard/ProductCard';

// function Tentes() {
//     const [activeTab, setActiveTab] = useState('location');
//     const navigate = useNavigate();
//     const [products, setProducts] = useState([]);
    
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [openRentalDialog, setOpenRentalDialog] = useState(false);
//     useEffect(() => {
//         fetchProducts();
//       }, []);
    
//       const fetchProducts = async () => {
//         try {
//           const querySnapshot = await getDocs(collection(db, 'products'));
//           const productsData = querySnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           }));
    
//           // Ne conserver que les produits de la catégorie "Tentes"
//           const tentesProducts = productsData.filter(product => product.category === 'Tentes');
//           setProducts(tentesProducts);
//         } catch (error) {
//           console.error('Error fetching products:', error);
//         }
//       };
//       const handleRentClick = (product) => {
//         setSelectedProduct(product);
//         setOpenRentalDialog(true);
//       };

//      useEffect(() => {
//             window.scrollTo(0, 0);
//         }, []);

//     return (
//         <div className='tentesContainer'>
//             <div className='tentesHeader'>
//                 <h1>Tentes</h1>
//                 <h2>Découvrez notre sélection exclusive de tentes de réception, alliant style et fonctionnalité pour faire de votre événement un succès inoubliable.</h2>
//             </div>

//             {/* Onglets */}
//             <div className="tabs">
         
//             </div>

           
//             <section>
//           <Container>
//         <div className="products__header">
//           <Typography variant="h4" component="h1" className="products__title">
//             Tentes en location
//           </Typography>
//         </div>

//         <div className="products__grid">
//           {products.map((product) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               onRent={handleRentClick}
//             />
//           ))}
//         </div>

//         {selectedProduct && (
//           <RentalDialog
//             open={openRentalDialog}
//             onClose={() => setOpenRentalDialog(false)}
//             product={selectedProduct}
//           />
//         )}
//       </Container>
//             </section>
//             <section>
              
//                 <div className='choiceContainer'>
//                 <div className='choix1'>
//                     <h3>Une question ? </h3>
//                     <img src="" alt="" />
//                     <button>Contactez nous</button>
//                 </div>
//                 <div className='choix2'>
//                     <h3>Vous voulez réserver ?</h3>
//                     <img src="" alt="" />
//                     <button>Demander un devis</button>
//                 </div>
//                 </div>
//             </section>
//             <section className='sectionCard'>
//                 <h2>Nos produits sur devis</h2>
//                 <p>Nos produits en location ne convienne pas à vos besoins? Essayer une de nos trois tentes disponible sur devis</p>
//                 <div className='tenteCardContainer'>
//                     <div className='tenteCard'>
//                         <h4>Tentes de réception</h4>
//                         <img src="/img/tentespliantes/tente-de-reception.png" alt="" />
//                         <ul>
//                             <li> De 24m² à 364m²</li>
//                             <li>De 295€ à 2690€</li>
//                             <li> De multiples options disponnible</li>
//                             <li>Avec ou sans installation</li>
//                         </ul>
//                         <button onClick={() => navigate('/tentes-reception')}>Voir toutes les tentes de réception</button>
//                     </div>
//                     <div className='tenteCard'>
//                         <h4>Pagodes</h4>
//                         <img src="/img/tentespliantes/pagode-de-reception.png" alt="" />
//                         <ul>
//                             <li> De 16m² à 36m²</li>
//                             <li>De 290€ à 360€</li>
//                             <li> De multiples options disponnible</li>
//                             <li>Avec ou sans installation</li>
//                         </ul>
//                         <button onClick={() => navigate('/pagodes')}>Voir toutes les pagodes de réception</button>
//                     </div>
//                     <div className='tenteCard'>
//                         <h4>Tentes pliantes</h4>
//                         <img src="/img/tentespliantes/tentes-pliantes.png" alt="" />
//                         <ul>
//                             <li> De 9m² à 32m²</li>
//                             <li>De 65€ à 225€</li>
//                             <li> De multiples options disponnible</li>
//                             <li>Avec ou sans installation</li>
//                         </ul>
//                         <button onClick={() => navigate('/tentes-pliantes')}>Voir toutes les tentes pliantes</button>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }

// export default Tentes;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import "./_Tentes.scss";
import ProductCard from '../../components/ProductCard/ProductCard';

function Tentes() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Appeler votre API pour récupérer les produits de la catégorie "Tentes"
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        const data = await response.json();
        const tentesProducts = data.filter((product) => product.category === 'Tentes');
        setProducts(tentesProducts);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    };

    fetchProducts();
  }, []);

  const handleRentClick = (product) => {
    setSelectedProduct(product);
    setOpenRentalDialog(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='tentesContainer'>
      <div className='tentesHeader'>
        <h1>Tentes</h1>
        <h2>
          Découvrez notre sélection exclusive de tentes de réception, alliant style et fonctionnalité pour faire de votre événement un succès inoubliable.
        </h2>
      </div>

      <section>
        <Container>
          <div className="products__header">
            <Typography variant="h4" component="h1" className="products__title">
              Tentes en location
            </Typography>
          </div>

          <div className="products__grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
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
      </section>

      <section>
        <div className='choiceContainer'>
          <div className='choix1'>
            <h3>Une question ?</h3>
            <img src="" alt="" />
            <button>Contactez nous</button>
          </div>
          <div className='choix2'>
            <h3>Vous voulez réserver ?</h3>
            <img src="" alt="" />
            <button>Demander un devis</button>
          </div>
        </div>
      </section>

      <section className='sectionCard'>
        <h2>Nos produits sur devis</h2>
        <p>Nos produits en location ne conviennent pas à vos besoins ? Essayez une de nos trois tentes disponibles sur devis</p>
        <div className='tenteCardContainer'>
          <div className='tenteCard'>
            <h4>Tentes de réception</h4>
            <img src="/img/tentespliantes/tente-de-reception.png" alt="" />
            <ul>
              <li> De 24m² à 364m²</li>
              <li>De 295€ à 2690€</li>
              <li>De multiples options disponibles</li>
              <li>Avec ou sans installation</li>
            </ul>
            <button onClick={() => navigate('/tentes-reception')}>Voir toutes les tentes de réception</button>
          </div>
          <div className='tenteCard'>
            <h4>Pagodes</h4>
            <img src="/img/tentespliantes/pagode-de-reception.png" alt="" />
            <ul>
              <li> De 16m² à 36m²</li>
              <li>De 290€ à 360€</li>
              <li>De multiples options disponibles</li>
              <li>Avec ou sans installation</li>
            </ul>
            <button onClick={() => navigate('/pagodes')}>Voir toutes les pagodes de réception</button>
          </div>
          <div className='tenteCard'>
            <h4>Tentes pliantes</h4>
            <img src="/img/tentespliantes/tentes-pliantes.png" alt="" />
            <ul>
              <li> De 9m² à 32m²</li>
              <li>De 65€ à 225€</li>
              <li>De multiples options disponibles</li>
              <li>Avec ou sans installation</li>
            </ul>
            <button onClick={() => navigate('/tentes-pliantes')}>Voir toutes les tentes pliantes</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Tentes;
