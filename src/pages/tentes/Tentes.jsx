import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./_Tentes.scss";

function Tentes() {
    const [activeTab, setActiveTab] = useState('location');
    const navigate = useNavigate();
    const produits = [
        {
            id: 1,
            nom: "Tente pliante 3x3m 9m² SANS côtés",
            prix: "65,00€ TTC",
            categorie: "tente",
            image: "tente.jpg"
        }
    ];

    const produitsTentes = produits.filter(produit => produit.categorie === "tente");

    return (
        <div className='tentesContainer'>
            <div className='tentesHeader'>
                <h1>Tentes</h1>
                <h2>Découvrez notre sélection exclusive de tentes de réception, alliant style et fonctionnalité pour faire de votre événement un succès inoubliable.</h2>
            </div>

            {/* Onglets */}
            <div className="tabs">
         
            </div>

           
            <section>
          <h2>Tentes en location</h2>

            </section>
            <section>
              
                <div className='choiceContainer'>
                <div className='choix1'>
                    <h3>Une question ? </h3>
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
                <p>Nos produits en location ne convienne pas à vos besoins? Essayer une de nos trois tentes disponible sur devis</p>
                <div className='tenteCardContainer'>
                    <div className='tenteCard'>
                        <h4>Tentes de réception</h4>
                        <img src="" alt="" />
                        <ul>
                            <li> De 24m² à 364m²</li>
                            <li>De 295€ à 2690€</li>
                            <li> De multiples options disponnible</li>
                            <li>Avec ou san installation</li>
                        </ul>
                        <button onClick={() => navigate('/tentes-reception')}>Voir toutes les tentes de réception</button>
                    </div>
                    <div className='tenteCard'>
                        <h4>Pagodes</h4>
                        <img src="" alt="" />
                        <ul>
                            <li> De 16m² à 36m²</li>
                            <li>De 290€ à 360€</li>
                            <li> De multiples options disponnible</li>
                            <li>Avec ou san installation</li>
                        </ul>
                        <button onClick={() => navigate('/pagodes')}>Voir toutes les pagodes de réception</button>
                    </div>
                    <div className='tenteCard'>
                        <h4>Tentes pliantes</h4>
                        <img src="" alt="" />
                        <ul>
                            <li> De 9m² à 32m²</li>
                            <li>De 65€ à 225€</li>
                            <li> De multiples options disponnible</li>
                            <li>Avec ou san installation</li>
                        </ul>
                        <button onClick={() => navigate('/tentes-pliantes')}>Voir toutes les tentes pliantes</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Tentes;
