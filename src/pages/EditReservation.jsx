import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { restaurants } from '../data/restaurants';
import ReservationForm from '../components/ReservationForm';
import { ArrowLeft } from '../components/Icons';
export default function EditReservationPage() {
  const {id}=useParams(); const nav=useNavigate(); const [reservation,setReservation]=useState(null); const [error,setError]=useState('');
  useEffect(()=>{api.reservations().then(d=>setReservation(d.reservations.find(r=>r.id===id)||null)).catch(e=>setError(e.message))},[id]);
  if(error)return <main className="page-container"><p className="form-error">{error}</p><Link to="/my-reservations">Back</Link></main>;
  if(!reservation)return <main className="page-container"><p>Loading reservation…</p></main>;
  const restaurant=restaurants.find(r=>r.id===reservation.restaurantId)||{id:reservation.restaurantId,name:reservation.restaurantName,image:restaurants[0].image};
  return <main className="page-container edit-page"><Link to="/my-reservations" className="back-link"><ArrowLeft size={16}/> Back to reservations</Link><div className="edit-card"><span className="eyebrow">CHANGE YOUR PLANS</span><h1>Edit your <em>reservation.</em></h1><p>Update the details below and save your changes.</p><ReservationForm restaurant={restaurant} initial={reservation} submitLabel="Save changes" onSubmit={async data=>{const result=await api.updateReservation(id,data);nav('/confirmation',{state:{reservation:result.reservation,edited:true}})}}/></div></main>;
}
