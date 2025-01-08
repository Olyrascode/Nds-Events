// import { useState, useEffect } from 'react';
// import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

// export default function ProductOptions({ options, selectedOption, onChange }) {
//   const handleOptionChange = (optionName, value) => {
//     const option = options.find(opt => opt.name === optionName);
//     const valueIndex = option.values.indexOf(value);
//     const price = option.prices[valueIndex];
    
//     onChange({
//       name: optionName,
//       value,
//       price
//     });
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Option du produit
//       </Typography>
//       {options.map((option) => (
//         <FormControl key={option.name} fullWidth margin="normal">
//           <InputLabel>{option.name}</InputLabel>
//           <Select
//             value={selectedOption?.name === option.name ? selectedOption.value : ''}
//             label={option.name}
//             onChange={(e) => handleOptionChange(option.name, e.target.value)}
//             required
//           >
//             {option.values.map((value, index) => (
//               <MenuItem key={index} value={value}>
//                 {value} - €{option.prices[index]}/day
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       ))}
//     </Box>
//   );
// }
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

export default function ProductOptions({ options, selectedOptions, onChange }) {

  const handleOptionChange = (optionName, value) => {
    const option = options.find(opt => opt.name === optionName);
    const valueIndex = option.values.indexOf(value);
    const price = option.prices[valueIndex];
    
    onChange((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [optionName]: {
        name: optionName,
        value,
        price
      }
    }));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Option du produit
      </Typography>
      {options.map((option) => (
        <FormControl key={option.name} fullWidth margin="normal">
          <InputLabel>{option.name}</InputLabel>
          <Select
            value={selectedOptions[option.name]?.value || ''}
            label={option.name}
            onChange={(e) => handleOptionChange(option.name, e.target.value)}
            required
          >
            {option.values.map((value, index) => (
              <MenuItem key={index} value={value}>
                {value} | +{option.prices[index]}€/jours
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
}
