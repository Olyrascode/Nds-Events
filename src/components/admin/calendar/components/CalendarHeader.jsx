
import { Box, Typography } from '@mui/material';
import { HeaderCell } from '../styles/CalendarStyles';

export default function CalendarHeader() {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <Box sx={{ display: 'flex' }}>
      {weekDays.map(day => (
        <HeaderCell key={day}>
          <Typography variant="subtitle2" fontWeight="bold">
            {day}
          </Typography>
        </HeaderCell>
      ))}
    </Box>
  );
}
