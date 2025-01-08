import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { addDays } from 'date-fns';

export default function RentalPeriod({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  minStartDate 
}) {
  const handleStartDateChange = (newDate) => {
    onStartDateChange(newDate);
    if (endDate <= newDate) {
      onEndDateChange(addDays(newDate, 1));
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Période de location
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          minDate={minStartDate}
          slotProps={{
            textField: { fullWidth: true }
          }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={onEndDateChange}
          minDate={addDays(startDate, 1)}
          slotProps={{
            textField: { fullWidth: true }
          }}
        />
      </Box>
    </Box>
  );
}