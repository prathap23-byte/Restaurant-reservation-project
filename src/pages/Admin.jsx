import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CalendarDays, Users, Trash2 } from '../components/Icons';
export default function Admin() {
  const [items,setItems]=useState([]);const [error,setError]=useState('');const [loading,setLoading]=useState(true);
  async function load(){setLoading(true);try{const d=await api.reservations();setItems(d.reservations)}catch(e){setError(e.message)}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  async function remove(id){if(!confirm('Delete this reservation permanently?'))return;try{await api.deleteReservation(id);setItems(v=>v.filter(r=>r.id!==id))}catch(e){setError(e.message)}}
  return <main className="page-container"><div className="page-heading"><div><span className="eyebrow">OPERATIONS</span><h1>Reservation <em>desk.</em></h1><p>Development admin view of reservations stored by the local API.</p></div></div>{error&&<p className="form-error">{error}</p>}{loading?<p>Loading…</p>:<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Restaurant / Guest</th><th>Date & time</th><th>Party</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map(r=><tr key={r.id}><td><strong>{r.restaurantName}</strong><small>{r.name} · {r.email}</small></td><td><CalendarDays size={14}/> {r.date}<small>{r.time}</small></td><td><Users size={14}/> {r.guests}</td><td><span className="status-pill">{r.status||'Confirmed'}</span></td><td><button className="btn btn-quiet btn-small" onClick={()=>remove(r.id)}><Trash2 size={14}/> Delete</button></td></tr>)}</tbody></table>{!items.length&&<div className="empty-state"><p>No reservations yet.</p></div>}</div>}</main>;
}
