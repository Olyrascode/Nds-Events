import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  IconButton,
  Avatar,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatPrice } from '../../../utils/priceUtils';

export default function CartItem({ item, onRemove }) {
  const secondaryText = (
    <>
      <Typography variant="body2" component="span" display="block">
        Quantité: {item.quantity}
      </Typography>
      <Typography variant="body2" component="span" display="block">
        {formatPrice(item.price)}/jour
      </Typography>
      {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, value]) => (
        <Typography key={key} variant="body2" component="span" display="block" color="text.secondary">
          {key}: {value}
        </Typography>
      ))}
    </>
  );

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={item.imageUrl} alt={item.title || item.name} />
      </ListItemAvatar>
      <ListItemText
        primary={item.title || item.name}
        secondary={secondaryText}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}