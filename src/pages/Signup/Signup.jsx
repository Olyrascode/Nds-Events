// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { TextField, Button, Paper, Typography, Box } from '@mui/material';

// export default function Signup() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       return setError('Passwords do not match');
//     }
//     try {
//       setError('');
//       await signup(email, password);
//       navigate('/');
//     } catch (err) {
//       setError('Failed to create an account');
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//       <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
//         <Typography variant="h5" component="h1" gutterBottom>
//           Créer un compte
//         </Typography>
//         {error && (
//           <Typography color="erreur" sx={{ mb: 2 }}>
//             {error}
//           </Typography>
//         )}
//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Mot de passe"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Confirmez le mot de passe"
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             margin="normal"
//             required
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             sx={{ mt: 2 }}
//           >
//             Créer mon compte
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// }
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../features/authSlice'; // Assurez-vous que le fichier authSlice.js est configuré
import { TextField, Button, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setLocalError('Les mots de passe ne correspondent pas.');
    }

    setLocalError('');

    dispatch(signup({ email, password }))
      .unwrap() // Pour capturer les erreurs éventuelles
      .then(() => {
        navigate('/'); // Redirige l'utilisateur après succès
      })
      .catch((err) => {
        console.error('Erreur lors de la création du compte :', err);
      });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Créer un compte
        </Typography>

        {/* Affichage des erreurs */}
        {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirmez le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />

          {/* Bouton avec indicateur de chargement */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Créer mon compte'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
