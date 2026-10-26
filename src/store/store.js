import { configureStore, createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
  name: 'auth', initialState: { user: JSON.parse(localStorage.getItem('gg_user') || 'null'), token: localStorage.getItem('gg_token') || null },
  reducers: {
    signedIn(state, action) { state.user = action.payload.user; state.token = action.payload.token; },
    signedOut(state) { state.user = null; state.token = null; }
  }
});
const reservationSlice = createSlice({
  name: 'reservations', initialState: { items: [], loading: false, error: null },
  reducers: {
    setReservations(state, action) { state.items = action.payload; state.error = null; },
    setReservationLoading(state, action) { state.loading = action.payload; },
    setReservationError(state, action) { state.error = action.payload; },
    addReservation(state, action) { state.items.unshift(action.payload); },
    replaceReservation(state, action) { state.items = state.items.map(item => item.id === action.payload.id ? action.payload : item); },
    removeReservation(state, action) { state.items = state.items.filter(item => item.id !== action.payload); }
  }
});
const restaurantSlice = createSlice({ name: 'restaurants', initialState: { items: [], loading: false, error: null }, reducers: {
  setRestaurants(state, action) { state.items = action.payload; state.loading = false; },
  setRestaurantLoading(state, action) { state.loading = action.payload; },
  setRestaurantError(state, action) { state.error = action.payload; state.loading = false; }
}});
export const { signedIn, signedOut } = authSlice.actions;
export const { setReservations, setReservationLoading, setReservationError, addReservation, replaceReservation, removeReservation } = reservationSlice.actions;
export const { setRestaurants, setRestaurantLoading, setRestaurantError } = restaurantSlice.actions;
export const store = configureStore({ reducer: { auth: authSlice.reducer, reservations: reservationSlice.reducer, restaurants: restaurantSlice.reducer } });
