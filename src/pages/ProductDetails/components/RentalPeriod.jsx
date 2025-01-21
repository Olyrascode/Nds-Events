// import { Box, Typography } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
// import { addDays } from 'date-fns';

// export default function RentalPeriod({ 
//   startDate, 
//   endDate, 
//   onStartDateChange, 
//   onEndDateChange,
//   minStartDate 
// }) {
//   const handleStartDateChange = (newDate) => {
//     onStartDateChange(newDate);
//     if (endDate <= newDate) {
//       onEndDateChange(addDays(newDate, 1));
//     }
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Période de location
//       </Typography>
//       <Box sx={{ display: 'flex', gap: 2 }}>
//         <DatePicker
//           label="Start Date"
//           value={startDate}
//           onChange={handleStartDateChange}
//           minDate={minStartDate}
//           slotProps={{
//             textField: { fullWidth: true }
//           }}
//         />
//         <DatePicker
//           label="End Date"
//           value={endDate}
//           onChange={onEndDateChange}
//           minDate={addDays(startDate, 1)}
//           slotProps={{
//             textField: { fullWidth: true }
//           }}
//         />
//       </Box>
//     </Box>
//   );
// }
import { Box, Typography } from '@mui/material';
import { DatePicker, PickersDay } from '@mui/x-date-pickers';
import { addDays, isSunday } from 'date-fns';
import { styled } from '@mui/material/styles';

// Style personnalisé pour les dimanches
const StyledSundayDay = styled(PickersDay)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: theme.palette.error.main,
  },
}));

export default function RentalPeriod({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  minStartDate 
}) {
  // Désactiver les dimanches
  const disableSundays = (date) => isSunday(date);

  // Personnaliser les dimanches pour les rendre rouges
  const renderDay = (day, selectedDates, pickersDayProps) => {
    if (isSunday(day)) {
      return <StyledSundayDay {...pickersDayProps} />;
    }
    return <PickersDay {...pickersDayProps} />;
  };

  const handleStartDateChange = (newDate) => {
    onStartDateChange(newDate);

    // Réinitialiser la date de fin si elle est invalide ou si aucune date de début n'est sélectionnée
    if (endDate && newDate >= endDate) {
      onEndDateChange(null);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Période de location
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Date de début */}
        <DatePicker
          label="Début de location"
          value={startDate}
          onChange={handleStartDateChange}
          minDate={minStartDate} // Bloquer les 2 premiers jours
          shouldDisableDate={disableSundays} // Bloquer les dimanches
          renderDay={renderDay} // Appliquer le style rouge aux dimanches
          slotProps={{
            textField: { fullWidth: true }
          }}
        />

        {/* Date de fin */}
        <DatePicker
          label="Fin de location"
          value={endDate}
          onChange={onEndDateChange}
          minDate={startDate ? addDays(startDate, 1) : null} // Toujours au moins un jour après startDate
          shouldDisableDate={disableSundays} // Bloquer les dimanches
          renderDay={renderDay} // Appliquer le style rouge aux dimanches
          disabled={!startDate} // Désactiver si aucune date de début n'est sélectionnée
          slotProps={{
            textField: { fullWidth: true }
          }}
        />
      </Box>
    </Box>
  );
}
