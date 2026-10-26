import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReservationForm, { validateReservation } from '../components/ReservationForm';
const restaurant={id:'1',name:'Olive & Ember'};
describe('reservation validation',()=>{
  it('requires a name, date, time and valid guest count',()=>{
    const errors=validateReservation({name:'',date:'',time:'',guests:'0'});
    expect(errors.name).toBeTruthy();expect(errors.date).toBeTruthy();expect(errors.guests).toBeTruthy();
  });
  it('accepts valid reservation values',()=>{
    const errors=validateReservation({name:'Alex',date:new Date(Date.now()+86400000).toISOString().slice(0,10),time:'19:00',guests:'2'});
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
it('shows validation messages before submitting',async()=>{
  const onSubmit=vi.fn();
  render(<ReservationForm restaurant={restaurant} onSubmit={onSubmit}/>);
  fireEvent.click(screen.getByRole('button',{name:/confirm reservation/i}));
  expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});
it('submits valid reservation details',async()=>{
  const onSubmit=vi.fn().mockResolvedValue({});
  render(<ReservationForm restaurant={restaurant} onSubmit={onSubmit}/>);
  fireEvent.change(screen.getByPlaceholderText(/your full name/i),{target:{value:'Alex Guest'}});
  fireEvent.change(screen.getByLabelText(/date/i),{target:{value:new Date(Date.now()+86400000).toISOString().slice(0,10)}});
  fireEvent.click(screen.getByRole('button',{name:/confirm reservation/i}));
  await waitFor(()=>expect(onSubmit).toHaveBeenCalled());
  expect(onSubmit.mock.calls[0][0].restaurantId).toBe('1');
});
