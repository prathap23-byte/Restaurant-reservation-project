import { useState } from 'react';
import { CalendarDays, Clock3, Users } from './Icons';
export function validateReservation(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.date) errors.date = 'Choose a date.';
  else if (values.date < new Date().toISOString().slice(0,10)) errors.date = 'Choose today or a future date.';
  if (!values.time) errors.time = 'Choose a time.';
  if (!values.guests || Number(values.guests) < 1 || Number(values.guests) > 12) errors.guests = 'Choose between 1 and 12 guests.';
  return errors;
}
export default function ReservationForm({ restaurant, initial = {}, onSubmit, submitLabel = 'Confirm reservation' }) {
  const [values, setValues] = useState({ name: initial.name || '', date: initial.date || '', time: initial.time || '19:00', guests: String(initial.guests || 2), occasion: initial.occasion || '', notes: initial.notes || '' });
  const [errors, setErrors] = useState({}); const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const change = e => setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  async function submit(e) {
    e.preventDefault(); const next = validateReservation(values); setErrors(next); setMessage('');
    if (Object.keys(next).length) return;
    setBusy(true);
    try { await onSubmit({ ...values, guests: Number(values.guests), restaurantId: restaurant.id, restaurantName: restaurant.name }); }
    catch (err) { setMessage(err.message || 'Could not save your reservation. Please try again.'); }
    finally { setBusy(false); }
  }
  return <form className="reservation-form" onSubmit={submit} noValidate>
    <div className="form-grid"><label className="field field-wide">Name on reservation<input name="name" value={values.name} onChange={change} placeholder="Your full name" autoComplete="name"/>{errors.name && <small className="field-error">{errors.name}</small>}</label>
    <label className="field"><span><CalendarDays size={15}/> Date</span><input type="date" name="date" min={new Date().toISOString().slice(0,10)} value={values.date} onChange={change}/>{errors.date && <small className="field-error">{errors.date}</small>}</label>
    <label className="field"><span><Clock3 size={15}/> Time</span><select name="time" value={values.time} onChange={change}>{['12:00','12:30','13:00','13:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'].map(t=><option key={t}>{t}</option>)}</select>{errors.time && <small className="field-error">{errors.time}</small>}</label>
    <label className="field"><span><Users size={15}/> Guests</span><select name="guests" value={values.guests} onChange={change}>{Array.from({length:12},(_,i)=>i+1).map(n=><option key={n} value={n}>{n} {n===1?'guest':'guests'}</option>)}</select>{errors.guests && <small className="field-error">{errors.guests}</small>}</label>
    <label className="field"><span>Occasion (optional)</span><select name="occasion" value={values.occasion} onChange={change}><option value="">Just because</option><option>Birthday</option><option>Anniversary</option><option>Business meal</option><option>Family gathering</option></select></label>
    <label className="field field-wide"><span>Anything we should know? (optional)</span><textarea name="notes" value={values.notes} onChange={change} rows="3" placeholder="Dietary needs, seating preferences…"/></label></div>
    {message && <p className="form-error" role="alert">{message}</p>}
    <button className="btn btn-dark btn-block" disabled={busy}>{busy ? 'Saving your table…' : submitLabel}</button>
    <p className="form-footnote">No payment required to reserve. You can manage your booking later.</p>
  </form>;
}
