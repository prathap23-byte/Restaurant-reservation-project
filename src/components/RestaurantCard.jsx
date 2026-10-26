import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from './Icons';
export default function RestaurantCard({ restaurant }) {
  return <article className="restaurant-card">
    <Link className="restaurant-image-wrap" to={`/restaurant/${restaurant.id}`} aria-label={`View ${restaurant.name}`}>
      <img src={restaurant.image} alt={restaurant.name} loading="lazy" />
      <span className="image-tag">{restaurant.tags?.[0] || 'Guest favourite'}</span>
      <span className="rating"><Star size={14} fill="currentColor" /> {restaurant.rating}</span>
    </Link>
    <div className="restaurant-card-body">
      <div className="restaurant-meta"><span>{restaurant.cuisine}</span><span>{restaurant.price}</span></div>
      <h3><Link to={`/restaurant/${restaurant.id}`}>{restaurant.name}</Link></h3>
      <p className="location"><MapPin size={14}/>{restaurant.area}</p>
      <div className="card-bottom"><span className="muted">{restaurant.time || 'Tables available today'}</span><Link className="round-link" to={`/restaurant/${restaurant.id}`} aria-label={`Reserve at ${restaurant.name}`}><ArrowRight size={17}/></Link></div>
    </div>
  </article>;
}
