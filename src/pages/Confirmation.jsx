import { Link, useLocation } from 'react-router-dom';
import { Check, CalendarDays, Clock3, Users, ArrowRight } from '../components/Icons';
export default function Confirmation() {
  const {state}=useLocation(); const r=state?.reservation;
  return <main className="confirmation-page"><div className="confirmation-card"><span className="confirmation-check"><Check size={30}/></span><span className="eyebrow">{state?.edited?'BOOKING UPDATED':'IT’S OFFICIALLY A PLAN'}</span><h1>{state?.edited?'Your changes are saved.':'Table for a good time.'}</h1><p>{r?'Your reservation details are ready below.':'Your action has completed. Check My reservations for the latest booking details.'}</p>{r&&<div className="confirmed-details"><h2>{r.restaurantName}</h2><div><CalendarDays size={17}/>{r.date}</div><div><Clock3 size={17}/>{r.time}</div><div><Users size={17}/>{r.guests} {r.guests===1?'guest':'guests'}</div><span className="status-pill">{r.status||'Confirmed'}</span></div>}<div className="confirmation-actions"><Link to="/my-reservations" className="btn btn-dark">View my reservations <ArrowRight size={16}/></Link><Link to="/" className="text-link">Discover more places</Link></div></div></main>;
}
