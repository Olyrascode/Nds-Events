// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // 📌 Fonction pour récupérer le stock depuis l'API
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// // Thunk pour récupérer le stock disponible en fonction des dates
// export const fetchAvailableStock = createAsyncThunk(
//   "stock/fetchAvailableStock",
//   async ({ productId, startDate, endDate }) => {
//     const response = await fetch(`${API_URL}/api/stock/${productId}?startDate=${startDate}&endDate=${endDate}`);
//     if (!response.ok) throw new Error("Erreur récupération stock");
//     const data = await response.json();
//     return { productId, availableStock: data.availableStock };
//   }
// );

// // Slice Redux
// const stockSlice = createSlice({
//   name: "stock",
//   initialState: {
//     stockByProduct: {}, // { productId: stock }
//     loading: false,
//     error: null,
//   },
//   reducers: {}, // Pas besoin d'autres reducers pour l'instant
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAvailableStock.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAvailableStock.fulfilled, (state, action) => {
//         const { productId, availableStock } = action.payload;
//         state.stockByProduct[productId] = availableStock;
//         state.loading = false;
//       })
//       .addCase(fetchAvailableStock.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default stockSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchAvailableStock = createAsyncThunk(
  'stock/fetchAvailableStock',
  async ({ productId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/stock/${productId}?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la récupération du stock');
      }

      const data = await response.json();
      return { productId, availableStock: data.availableStock };
    } catch (error) {
      return rejectWithValue('Erreur serveur');
    }
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    stockByProduct: {}, // Structure : { productId: stockValue }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stockByProduct[action.payload.productId] = action.payload.availableStock;
      })
      .addCase(fetchAvailableStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default stockSlice.reducer;
