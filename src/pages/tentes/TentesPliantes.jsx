import React, { useState } from 'react';

function TentesPliantes() {
    const images = [
        '/img/tentespliantes/tente-reception.jpg',
        '/img/tentespliantes/tente-pliante-reception.jpg',
        '/img/tentespliantes/tente-de-reception-sans-cote.jpg',
        '/img/tentespliantes/pagodes-reception.jpg'
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
    return (
        <div>
              <div className='tentesHeader'>
                <h1>TENTES PLIANTES</h1>
                <p>Découvrez notre sélection de tentes pliantes pour tous vos événements en extérieur.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
            <button onClick={prevImage} style={{ marginRight: '10px' }}>←</button>
            <img src={images[currentImageIndex]} alt={`Slide ${currentImageIndex + 1}`} style={{ width: '600px', height: '400px' }} />
            <button onClick={nextImage} style={{ marginLeft: '10px' }}>→</button>
        </div>
        </div>
    )
} export default TentesPliantes