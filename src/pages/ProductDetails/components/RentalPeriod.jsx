
// import { Box, Typography } from '@mui/material';
// import { DatePicker, PickersDay } from '@mui/x-date-pickers';
// import { addDays, isSunday } from 'date-fns';
// import { styled } from '@mui/material/styles';

// // Style personnalisé pour les dimanches
// const StyledSundayDay = styled(PickersDay)(({ theme }) => ({
//   backgroundColor: theme.palette.error.light,
//   color: theme.palette.error.contrastText,
//   borderRadius: '50%',
//   '&:hover': {
//     backgroundColor: theme.palette.error.main,
//   },
// }));

// export default function RentalPeriod({ 
//   startDate, 
//   endDate, 
//   onStartDateChange, 
//   onEndDateChange, 
//   minStartDate 
// }) {
//   // Désactiver les dimanches
//   const disableSundays = (date) => isSunday(date);

//   // Personnaliser les dimanches pour les rendre rouges
//   const renderDay = (day, selectedDates, pickersDayProps) => {
//     if (isSunday(day)) {
//       return <StyledSundayDay {...pickersDayProps} />;
//     }
//     return <PickersDay {...pickersDayProps} />;
//   };

//   const handleStartDateChange = (newDate) => {
//     onStartDateChange(newDate);

//     // Réinitialiser la date de fin si elle est invalide ou si aucune date de début n'est sélectionnée
//     if (endDate && newDate >= endDate) {
//       onEndDateChange(null);
//     }
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Période de location
//       </Typography>
//       <Box sx={{ display: 'flex', gap: 2 }}>
//         {/* Date de début */}
//         <DatePicker
//           label="Début de location"
//           value={startDate}
//           onChange={handleStartDateChange}
//           minDate={minStartDate} // Bloquer les 2 premiers jours
//           shouldDisableDate={disableSundays} // Bloquer les dimanches
//           renderDay={renderDay} // Appliquer le style rouge aux dimanches
//           slotProps={{
//             textField: { fullWidth: true }
//           }}
//         />

//         {/* Date de fin */}
//         <DatePicker
//           label="Fin de location"
//           value={endDate}
//           onChange={onEndDateChange}
//           minDate={startDate ? addDays(startDate, 1) : null} // Toujours au moins un jour après startDate
//           shouldDisableDate={disableSundays} // Bloquer les dimanches
//           renderDay={renderDay} // Appliquer le style rouge aux dimanches
//           disabled={!startDate} // Désactiver si aucune date de début n'est sélectionnée
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
  minStartDate,
  disabled = false // nouvelle prop avec valeur par défaut false
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
    if (!disabled) { // N'autorise la modification que si disabled est false
      onStartDateChange(newDate);
      // Réinitialiser la date de fin si elle est invalide
      if (endDate && newDate >= endDate) {
        onEndDateChange(null);
      }
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
          disabled={disabled}  // Ajout de la prop disabled
          slotProps={{
            textField: { fullWidth: true }
          }}
        />

        {/* Date de fin */}
        <DatePicker
          label="Fin de location"
          value={endDate}
          onChange={(date) => {
            if (!disabled) onEndDateChange(date);
          }}
          minDate={startDate ? addDays(startDate, 1) : null} // Toujours au moins un jour après startDate
          shouldDisableDate={disableSundays} // Bloquer les dimanches
          renderDay={renderDay} // Appliquer le style rouge aux dimanches
          disabled={!startDate || disabled} // Désactive si aucune date de début n'est sélectionnée ou si disabled est true
          slotProps={{
            textField: { fullWidth: true }
          }}
        />
      </Box>
    </Box>
  );
}
