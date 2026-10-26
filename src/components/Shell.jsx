import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, UserRound, LogOut } from './Icons';
export function Header() {
  const { user, isAuthenticated, logout } = useAuth(); const navigate = useNavigate();
  return <header className="site-header"><div className="nav-inner">
    <Link to="/" className="brand"><span className="brand-mark"><Utensils size={19}/></span><span>gather<span className="brand-amp">&</span>grain<small>GOOD FOOD. GOOD COMPANY.</small></span></Link>
    <nav className="desktop-nav" aria-label="Main navigation"><NavLink to="/">Discover</NavLink><a href="/#how-it-works">How it works</a><NavLink to="/my-reservations">My reservations</NavLink></nav>
    <div className="nav-actions">{isAuthenticated ? <><span className="nav-greeting">Hi, {user?.name?.split(' ')[0]}</span><button className="btn btn-dark btn-small" onClick={() => {logout(); navigate('/');}}><LogOut size={15}/> Log out</button></> : <><Link className="login-link" to="/login">Log in</Link><Link className="btn btn-dark btn-small" to="/register"><UserRound size={15}/> Get started</Link></>}</div>
  </div></header>;
}
export function Footer() {
  return <footer className="site-footer"><div className="footer-main"><div className="brand footer-brand"><span className="brand-mark"><Utensils size={19}/></span><span>gather<span className="brand-amp">&</span>grain<small>GOOD FOOD. GOOD COMPANY.</small></span></div><p>Make room for something delicious.</p><div className="footer-links"><a href="/#restaurants">Discover</a><a href="/#how-it-works">How it works</a><Link to="/my-reservations">Your bookings</Link></div></div><div className="footer-bottom"><span>© 2026 Gather & Grain</span><span>Made for memorable meals.</span></div></footer>;
}
