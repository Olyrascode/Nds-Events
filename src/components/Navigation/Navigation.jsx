
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton,
  Typography,
  Box,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { menuItems, adminMenuItems } from './navigationConfig';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import CartDrawer from '../CartDrawer/CartDrawer';
import './_Navigation.scss';

export default function Navigation() {
  const { currentUser, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="static" className="navigation">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={handleMobileMenu}
        >
          <MenuIcon />
        </IconButton>
        <Link to="/" style={{ flexGrow: 0, textDecoration: 'none' }}>
  <img
    src="/img/home/logoHomePage.png"
    alt="NDS Events"
    style={{ height: '40px', color: 'white' }}
  />
</Link>


        <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 4, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              className={`navigation__link ${isActive(item.path) ? 'navigation__link--active' : ''}`}
            >
              {item.label}
            </Button>
          ))}
          {/* {currentUser?.isAdmin && adminMenuItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              className={`navigation__link ${isActive(item.path) ? 'navigation__link--active' : ''}`}
            >
              {item.label}
            </Button>
          ))} */}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={() => setIsCartOpen(true)}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {currentUser ? (
            <IconButton
              color="inherit"
              onClick={handleMenu}
              className="navigation__user-menu"
              alt="icon utilisatreur"
            >
              <AccountCircleIcon />
            </IconButton>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Connexion
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Créer un compte
              </Button>
            </>
          )}
        </Box>

        <UserMenu
          anchorEl={anchorEl}
          onClose={handleClose}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <MobileMenu
          anchorEl={mobileAnchorEl}
          onClose={handleClose}
          currentUser={currentUser}
          isActive={isActive}
        />

        <CartDrawer
          open={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </Toolbar>
    </AppBar>
  );
}