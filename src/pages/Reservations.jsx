import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReservations } from '../hooks/useReservations';
import { restaurants } from '../data/restaurants';
import { CalendarDays, Clock3, Users, Pencil, Trash2, ArrowRight, Utensils } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
export default function ReservationsPage() {
  const { user }=useAuth(); const {items,loading,error,load,remove}=useReservations();const [notice,setNotice]=useState('');const nav=useNavigate();
  useEffect(()=>{load()},[load]);
  const mine=items.filter(r=>!user||r.userId===user.id);
  async function cancel(r){if(!window.confirm(`Cancel your reservation at ${r.restaurantName}?`))return;try{await remove(r.id);setNotice('Reservation cancelled successfully.')}catch(e){setNotice(e.message)}}
  return <main className="page-container reservations-page"><div className="page-heading"><div><span className="eyebrow">YOUR PLANS, ALL IN ONE PLACE</span><h1>My <em>reservations.</em></h1><p>Keep track of the tables you're looking forward to.</p></div><Link to="/" className="btn btn-dark"><Utensils size={16}/> Find a table</Link></div>
    {notice&&<p className="notice" role="status">{notice}</p>}{loading&&<p className="subtle-status">Loading your reservations…</p>}{error&&<p className="form-error">Couldn't load reservations: {error}</p>}
    {!loading&&mine.length===0&&<div className="empty-state large-empty"><span className="empty-icon"><CalendarDays size={26}/></span><h2>No reservations yet.</h2><p>Your next favourite meal is waiting to be planned.</p><Link className="btn btn-dark" to="/">Explore restaurants <ArrowRight size={16}/></Link></div>}
    <div className="reservation-list">{mine.map(r=>{const place=restaurants.find(x=>x.id===r.restaurantId);return <article className="reservation-item" key={r.id}><img src={place?.image||restaurants[0].image} alt=""/><div className="reservation-item-main"><span className={`status-pill ${r.status==='Cancelled'?'status-cancelled':''}`}>{r.status||'Confirmed'}</span><h3>{r.restaurantName}</h3><p><CalendarDays size={15}/>{r.date} · <Clock3 size={15}/>{r.time}</p><p><Users size={15}/>{r.guests} {r.guests===1?'guest':'guests'}{r.occasion?` · ${r.occasion}`:''}</p></div><div className="reservation-actions"><button className="btn btn-outline btn-small" onClick={()=>nav(`/reservation/${r.id}/edit`,{state:{reservation:r}})}><Pencil size={14}/> Edit</button><button className="btn btn-quiet btn-small" onClick={()=>cancel(r)}><Trash2 size={14}/> Cancel</button></div></article>})}</div>
  </main>;
}
export function EditReservationPage() {
  const {id}=useNavigate() ? {id:null} : {id:null};
  return <main className="page-container"><h1>Edit reservation</h1><p>Open an existing booking from My reservations to edit its details.</p><Link to="/my-reservations" className="btn btn-dark">Back to reservations</Link></main>;
}
