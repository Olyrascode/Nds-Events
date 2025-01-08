import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Chip,
  Typography,
  Button,
  Grid,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function OptionsManager({ options, onChange }) {
  const [optionName, setOptionName] = useState('');
  const [optionValues, setOptionValues] = useState([]);
  const [tempValue, setTempValue] = useState('');
  const [tempPrice, setTempPrice] = useState('');

  const handleAddValue = () => {
    if (tempValue && tempPrice) {
      setOptionValues([
        ...optionValues,
        {
          value: tempValue,
          price: parseFloat(tempPrice)
        }
      ]);
      setTempValue('');
      setTempPrice('');
    }
  };

  const handleRemoveValue = (index) => {
    setOptionValues(optionValues.filter((_, i) => i !== index));
  };

  const handleSaveOption = () => {
    if (optionName && optionValues.length > 0) {
      const newOption = {
        name: optionName,
        values: optionValues.map(v => v.value),
        prices: optionValues.map(v => v.price)
      };
      onChange([...options, newOption]);
      
      // Reset form
      setOptionName('');
      setOptionValues([]);
    }
  };

  const handleRemoveOption = (index) => {
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
       Options du produit
      </Typography>

      {/* Existing Options */}
      {options.map((option, optionIndex) => (
        <Paper key={optionIndex} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {option.name}
            </Typography>
            <IconButton 
              color="error" 
              onClick={() => handleRemoveOption(optionIndex)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {option.values.map((value, valueIndex) => (
              <Chip
                key={valueIndex}
                label={`${value} - €${option.prices[valueIndex]}`}
              />
            ))}
          </Box>
        </Paper>
      ))}

      {/* Add New Option */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Ajouter une option
        </Typography>
        
        <TextField
          fullWidth
          label="Nom de l'option"
          value={optionName}
          onChange={(e) => setOptionName(e.target.value)}
          margin="normal"
        />

        {/* Values List */}
        {optionValues.length > 0 && (
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ajouter une valeur:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {optionValues.map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.value} - €${item.price}`}
                  onDelete={() => handleRemoveValue(index)}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Add Value Form */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs={5}>
            <TextField
              fullWidth
              label="Option"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              label="Prix par jours"
              type="number"
              value={tempPrice}
              onChange={(e) => setTempPrice(e.target.value)}
              size="small"
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="outlined"
              onClick={handleAddValue}
              fullWidth
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>

        {/* Save Option Button */}
        {optionName && optionValues.length > 0 && (
          <Button
            variant="contained"
            onClick={handleSaveOption}
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            fullWidth
          >
            Sauvegarder les options
          </Button>
        )}
      </Paper>
    </Box>
  );
}