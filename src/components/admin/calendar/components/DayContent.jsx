
import { Box, Typography } from '@mui/material';
import { format, isToday } from 'date-fns';
import OrderEventBar from './OrderEventBar';

export default function DayContent({ day, orders, onOrderClick }) {
  return (
    <>
      <Typography
        variant="body2"
        sx={{
          fontWeight: isToday(day) ? 'bold' : 'normal',
          color: isToday(day) ? 'primary.main' : 'text.primary'
        }}
      >
        {format(day, 'd')}
      </Typography>
      <Box sx={{ mt: 1 }}>
        {orders.map(order => (
          <OrderEventBar
            key={order.id}
            order={order}
            onClick={() => onOrderClick(order)}
            currentDate={day}
          />
        ))}
      </Box>
    </>
  );
}
