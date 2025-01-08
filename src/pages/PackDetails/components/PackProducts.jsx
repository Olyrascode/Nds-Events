import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { formatPrice } from '../../../utils/priceUtils';

export default function PackProducts({ products }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Produits inclus
      </Typography>
      <List>
        {products.map((product) => (
          <ListItem key={product.id}>
            <ListItemAvatar>
              <Avatar src={product.imageUrl} alt={product.title} />
            </ListItemAvatar>
            <ListItemText
              primary={product.title}
              secondary={`Quantity: ${product.quantity} | ${formatPrice(product.price)}/day`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}