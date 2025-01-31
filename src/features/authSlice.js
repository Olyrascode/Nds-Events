// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// // Thunk pour l'inscription
// export const signup = createAsyncThunk('auth/signup', async ({ email, password }, { rejectWithValue }) => {
//   try {
//     const response = await fetch(`${API_URL}/api/auth/signup`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to sign up');
//     }

//     const data = await response.json();
//     return { email, isAdmin: false }; // Retourne les infos utilisateur minimales
//   } catch (error) {
//     return rejectWithValue(error.message);
//   }
// });

// const initialState = {
//   user: null,
//   token: localStorage.getItem('authToken') || null,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     clearAuth(state) {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem('authToken');
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(signup.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(signup.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.error = null;
//       })
//       .addCase(signup.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to sign up';
//       });
//   },
// });

// export const { clearAuth } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || 'Erreur lors de l\'inscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue('Erreur serveur');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
