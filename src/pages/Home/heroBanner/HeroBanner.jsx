import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function HeroBanner() {
    return (
        <div className="homeHero">
            <div className='heroLocation'>
<p>Location de matériels de réception en Rhône-Alpes</p>
            </div>
            <div className='heroBanner'>

          <h2 className="homeTitle">
            <img src="../../img/home/logoHomePage.png" alt="" />
            </h2>
          <h3 className="homeSubtitle">
          Votre référence en location évènementielle
            </h3>
            <button className='homeCta'>
<Link to={"/products"}>Découvrez notre boutique</Link>
                </button>

          </div>
            </div>
        )
    
} 
export default HeroBanner