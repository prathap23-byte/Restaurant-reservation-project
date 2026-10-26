import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { restaurants } from '../data/restaurants';
import { api } from '../services/api';
import ReservationForm from '../components/ReservationForm';
import { MapPin, Star, Clock3, ArrowLeft, Check } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
export default function RestaurantDetail() {
  const { id } = useParams(); const [restaurant,setRestaurant]=useState(restaurants.find(r=>r.id===id)); const [error,setError]=useState(''); const { isAuthenticated }=useAuth(); const navigate=useNavigate();
  useEffect(()=>{api.restaurant(id).then(d=>setRestaurant(d.restaurant)).catch(()=>{});},[id]);
  if(!restaurant) return <main className="page-container"><h2>Restaurant not found</h2><Link to="/">Back to discover</Link></main>;
  async function reserve(data) {
    if(!isAuthenticated) { sessionStorage.setItem('pendingReservation',JSON.stringify(data)); navigate('/login',{state:{from:`/restaurant/${id}/reserve`}}); return; }
    const { api: unused } = {}; // keeps this page focused on the form flow
    const result = await api.createReservation(data);
    navigate('/confirmation',{state:{reservation:result.reservation}});
  }
  return <main className="detail-page"><Link to="/" className="back-link"><ArrowLeft size={16}/> Back to all restaurants</Link><div className="detail-layout"><div><div className="detail-photo"><img src={restaurant.image} alt={restaurant.name}/><span className="detail-photo-tag"><Star size={14} fill="currentColor"/> {restaurant.rating} · Guest favourite</span></div><div className="detail-copy"><div className="restaurant-meta"><span>{restaurant.cuisine}</span><span>{restaurant.price}</span></div><h1>{restaurant.name}</h1><p>{restaurant.description}</p><div className="detail-facts"><span><MapPin size={16}/>{restaurant.area}, Coimbatore</span><span><Clock3 size={16}/>{restaurant.time}</span></div><div className="detail-perks"><span><Check size={15}/> Easy cancellation</span><span><Check size={15}/> Instant confirmation</span></div></div></div><aside className="booking-panel"><div className="booking-panel-head"><span className="eyebrow">SAVE YOUR SEAT</span><h2>Book a table</h2><p>Tell us when you're coming.</p></div><ReservationForm restaurant={restaurant} onSubmit={reserve}/></aside></div></main>;
}
