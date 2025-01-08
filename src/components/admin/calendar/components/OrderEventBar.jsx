
import { Typography } from '@mui/material';
import { isSameDay } from 'date-fns';
import { EventBar } from '../styles/CalendarStyles';

export default function OrderEventBar({ order, onClick, currentDate }) {
  const startDate = order.startDate.toDate();
  const endDate = order.endDate.toDate();
  const isStart = isSameDay(startDate, currentDate);
  const isEnd = isSameDay(endDate, currentDate);

  return (
    <EventBar
      onClick={onClick}
      isStart={isStart}
      isEnd={isEnd}
    >
      <Typography variant="caption" noWrap>
        {`${order.billingInfo.firstName} ${order.billingInfo.lastName}`}
      </Typography>
    </EventBar>
  );
}
