import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../services/api';
import { setRestaurants, setRestaurantLoading, setRestaurantError } from '../store/store';
export function useRestaurants() {
  const dispatch = useDispatch();
  const state = useSelector(s => s.restaurants);
  const load = useCallback(async () => {
    dispatch(setRestaurantLoading(true));
    try { const data = await api.restaurants(); dispatch(setRestaurants(data.restaurants)); }
    catch (e) { dispatch(setRestaurantError(e.message)); }
  }, [dispatch]);
  return { ...state, load };
}
