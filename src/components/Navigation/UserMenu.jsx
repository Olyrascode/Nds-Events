import { Menu, MenuItem, Typography, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { adminMenuItems } from './navigationConfig';

export function UserMenu({ anchorEl, onClose, currentUser, onLogout }) {
  if (!currentUser) return null;

  const menuItems = [
    <MenuItem key="email" disabled>
      <Typography variant="body2" color="textSecondary">
        {currentUser.email}
      </Typography>
    </MenuItem>,
    <Divider key="divider-1" />,
    <MenuItem
      key="orders"
      component={Link}
      to="/account/orders"
      onClick={onClose}
    >
      Mes commandes
    </MenuItem>
  ];

  if (currentUser.isAdmin) {
    menuItems.push(
      <Divider key="divider-2" />,
      ...adminMenuItems.map((item) => (
        <MenuItem
          key={item.path}
          component={Link}
          to={item.path}
          onClick={onClose}
        >
          {item.label}
        </MenuItem>
      ))
    );
  }

  menuItems.push(
    <Divider key="divider-3" />,
    <MenuItem key="logout" onClick={onLogout}>
      Deconnexion
    </MenuItem>
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {menuItems}
    </Menu>
  );
}