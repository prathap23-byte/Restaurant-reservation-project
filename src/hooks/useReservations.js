import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../services/api';
import { setReservations, setReservationLoading, setReservationError, addReservation, replaceReservation, removeReservation } from '../store/store';
export function useReservations() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.reservations);
  const load = useCallback(async () => {
    dispatch(setReservationLoading(true)); dispatch(setReservationError(null));
    try { const data = await api.reservations(); dispatch(setReservations(data.reservations)); }
    catch (e) { dispatch(setReservationError(e.message)); }
    finally { dispatch(setReservationLoading(false)); }
  }, [dispatch]);
  const create = async data => { const result = await api.createReservation(data); dispatch(addReservation(result.reservation)); return result.reservation; };
  const update = async (id, data) => { const result = await api.updateReservation(id, data); dispatch(replaceReservation(result.reservation)); return result.reservation; };
  const remove = async id => { await api.deleteReservation(id); dispatch(removeReservation(id)); };
  return { items, loading, error, load, create, update, remove };
}
