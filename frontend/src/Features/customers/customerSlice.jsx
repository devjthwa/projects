import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
  const response = await axios.get('http://localhost:5000/api/customers');
  return response.data;
});

export const addCustomer = createAsyncThunk('customers/addCustomer', async (newCustomer) => {
  const response = await axios.post('http://localhost:5000/api/customers', newCustomer);
  return response.data;
});

export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (id) => {
  await axios.delete(`http://localhost:5000/api/customers/${id}`);
  return id;
});

export const updateCustomer = createAsyncThunk('customers/updateCustomer', async (customer) => {
  try {
    const response = await axios.patch(`http://localhost:5000/api/customers/${customer._id}`, customer);
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
});

// Slice
const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
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
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(customer => customer._id !== action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(customer => customer._id === action.payload._id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      });
  }
});

export const { setSearchTerm } = customerSlice.actions;

export default customerSlice.reducer;
