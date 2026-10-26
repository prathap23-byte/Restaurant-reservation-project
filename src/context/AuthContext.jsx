import { createContext, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signedIn, signedOut } from '../store/store';
import { api } from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const value = useMemo(() => ({
    user, token, isAuthenticated: Boolean(token),
    async login(email, password) {
      const result = await api.login({ email, password });
      localStorage.setItem('gg_token', result.token); localStorage.setItem('gg_user', JSON.stringify(result.user));
      dispatch(signedIn(result)); return result.user;
    },
    async register(name, email, password) {
      const result = await api.register({ name, email, password });
      localStorage.setItem('gg_token', result.token); localStorage.setItem('gg_user', JSON.stringify(result.user));
      dispatch(signedIn(result)); return result.user;
    },
    logout() { localStorage.removeItem('gg_token'); localStorage.removeItem('gg_user'); dispatch(signedOut()); }
  }), [user, token, dispatch]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
