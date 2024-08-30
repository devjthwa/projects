import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchInventories = createAsyncThunk('inventories/fetchInventories', async () => {
  const response = await axios.get('http://localhost:5000/api/inventories');
  return response.data;
});

export const addInventory = createAsyncThunk('inventories/addInventory', async (newInventory) => {
  const response = await axios.post('http://localhost:5000/api/inventories', newInventory);
  return response.data;
});

export const deleteInventory = createAsyncThunk('inventories/deleteInventory', async (id) => {
  await axios.delete(`http://localhost:5000/api/inventories/${id}`);
  return id;
});

export const updateInventory = createAsyncThunk('inventories/updateInventory', async (inventory) => {
  try {
    const response = await axios.patch(`http://localhost:5000/api/inventories/${inventory._id}`, inventory);
    return response.data;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
});

// Slice
const inventorySlice = createSlice({
  name: 'inventories',
  initialState: {
    inventories: [],
    status: 'idle',
    error: null,
    searchTerm: '',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInventories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.inventories = action.payload;
      })
      .addCase(fetchInventories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addInventory.fulfilled, (state, action) => {
        state.inventories.push(action.payload);
      })
      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.inventories = state.inventories.filter(inventory => inventory._id !== action.payload);
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        const index = state.inventories.findIndex(inventory => inventory._id === action.payload._id);
        if (index !== -1) {
          state.inventories[index] = action.payload;
        }
      });
  }
});

export const { setSearchTerm } = inventorySlice.actions;

export default inventorySlice.reducer;
