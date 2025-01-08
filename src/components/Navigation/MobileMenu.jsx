import { Menu, MenuItem, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { menuItems, adminMenuItems } from './navigationConfig';

export function MobileMenu({ anchorEl, onClose, currentUser, isActive }) {
  const items = [
    ...menuItems.map((item) => (
      <MenuItem
        key={item.path}
        component={Link}
        to={item.path}
        onClick={onClose}
        selected={isActive(item.path)}
      >
        {item.label}
      </MenuItem>
    )),
    ...(currentUser?.isAdmin
      ? [
          <Divider key="admin-divider" />,
          ...adminMenuItems.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={onClose}
              selected={isActive(item.path)}
            >
              {item.label}
            </MenuItem>
          ))
        ]
      : [])
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      {items}
    </Menu>
  );
}