
import { isSameDay, isWithinInterval } from 'date-fns';

export const getOrdersForDay = (orders = [], date) => {
  if (!orders.length) return [];
  
  return orders.filter(order => {
    const startDate = order.startDate.toDate();
    const endDate = order.endDate.toDate();
    
    return (
      isSameDay(startDate, date) ||
      isSameDay(endDate, date) ||
      isWithinInterval(date, { start: startDate, end: endDate })
    );
  });
};

export const getEventBarStyle = (isStart, isEnd, theme) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5, 1),
  marginBottom: theme.spacing(0.5),
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  position: 'relative',
  marginLeft: isStart ? 0 : -8,
  marginRight: isEnd ? 0 : -8,
  borderTopLeftRadius: isStart ? 4 : 0,
  borderBottomLeftRadius: isStart ? 4 : 0,
  borderTopRightRadius: isEnd ? 4 : 0,
  borderBottomRightRadius: isEnd ? 4 : 0,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
});
