import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRestaurants } from '../hooks/useRestaurants';
import { restaurants as fallbackRestaurants } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import { Search, SlidersHorizontal, ArrowRight, Sparkles, CalendarDays, Check } from '../components/Icons';
export default function Home() {
  const [query,setQuery]=useState(''); const [cuisine,setCuisine]=useState('All cuisines');
  const { items, loading, error, load } = useRestaurants();
  useEffect(()=>{load();},[load]);
  const all = items.length ? items : fallbackRestaurants;
  const cuisines = ['All cuisines', ...new Set(all.map(r=>r.cuisine))];
  const filtered = useMemo(()=>all.filter(r=>(`${r.name} ${r.cuisine} ${r.area}`.toLowerCase().includes(query.toLowerCase())) && (cuisine==='All cuisines'||r.cuisine===cuisine)),[all,query,cuisine]);
  return <main>
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"/> YOUR NEXT GREAT MEAL STARTS HERE</div><h1>Good food.<br/><em>Better together.</em></h1><p className="hero-description">Find your table, gather your people, and make a night of it. The best moments happen around a meal.</p><a className="btn btn-gold" href="#restaurants">Find your table <ArrowRight size={17}/></a><div className="hero-proof"><div className="proof-avatars"><span>J</span><span>M</span><span>A</span><span>+</span></div><div><strong>Loved by local foodies</strong><small>Thoughtful dining, made easy</small></div></div></div><div className="hero-art"><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=90" alt="Warm restaurant interior ready for dinner"/><div className="hero-note"><span className="note-icon"><CalendarDays size={19}/></span><span><strong>Your table is waiting</strong><small>Just a few clicks away</small></span><Check size={18} className="note-check"/></div><div className="hero-stamp"><span>MADE FOR</span><strong>the<br/>moments</strong><span>THAT MATTER</span></div></div></section>
    <section className="trust-strip"><div><Sparkles size={17}/><span>Handpicked local spots</span></div><div><CalendarDays size={17}/><span>Simple, flexible booking</span></div><div><Check size={17}/><span>Instant confirmation</span></div></section>
    <section className="section restaurants-section" id="restaurants"><div className="section-heading"><div><div className="eyebrow">A PLACE FOR EVERY CRAVING</div><h2>Find your <em>kind of table.</em></h2><p>From low-key lunches to little celebrations, there's a seat for you.</p></div><span className="result-count">{filtered.length} places to explore</span></div>
      <div className="search-bar"><Search size={19}/><input aria-label="Search restaurants" placeholder="Restaurant, cuisine, or neighbourhood…" value={query} onChange={e=>setQuery(e.target.value)}/><SlidersHorizontal size={18}/><select aria-label="Filter by cuisine" value={cuisine} onChange={e=>setCuisine(e.target.value)}>{cuisines.map(c=><option key={c}>{c}</option>)}</select></div>
      {loading && <p className="subtle-status">Checking the latest restaurant list…</p>}{error && <p className="subtle-status">Showing sample restaurant listings because the API is unavailable. Start the backend to enable reservations.</p>}
      <div className="restaurant-grid">{filtered.map(r=><RestaurantCard key={r.id} restaurant={r}/>)}</div>
      {!filtered.length && <div className="empty-state"><Search size={28}/><h3>No tables found just yet</h3><p>Try a different restaurant name or cuisine.</p><button className="btn btn-outline" onClick={()=>{setQuery('');setCuisine('All cuisines')}}>Clear filters</button></div>}
    </section>
    <section className="how-section" id="how-it-works"><div className="how-intro"><div className="eyebrow">LESS SCROLLING, MORE SAVOURING</div><h2>Your next favourite<br/><em>is three steps away.</em></h2><p>We take care of the planning, so you can focus on the people across the table.</p><Link to="/register" className="text-link">Get started <ArrowRight size={16}/></Link></div><div className="steps"><article><span>01</span><div><h3>Pick your place</h3><p>Explore handpicked spots for every mood and occasion.</p></div></article><article><span>02</span><div><h3>Make it yours</h3><p>Choose your date, time, and the people joining you.</p></div></article><article><span>03</span><div><h3>Show up hungry</h3><p>Your table is booked. All that's left is enjoying it.</p></div></article></div></section>
    <section className="closing-cta"><div><span className="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</span><h2>Good things happen<br/>around a <em>table.</em></h2></div><Link to="/#restaurants" className="btn btn-gold">Explore restaurants <ArrowRight size={17}/></Link></section>
  </main>;
}
