import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './features/customers/customerSlice';
import inventoryReducer from './Features/Inventory/inventoryslice';

const store = configureStore({
  reducer: {
    customers: customerReducer,
    inventories: inventoryReducer,
  },
});

export default store;