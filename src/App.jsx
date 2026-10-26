import { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header, Footer } from './components/Shell';
import ProtectedRoute from './components/ProtectedRoute';
const Home = lazy(() => import('./pages/Home'));
const RestaurantDetail = lazy(() => import('./pages/RestaurantDetail'));
const Reservations = lazy(() => import('./pages/Reservations'));
const EditReservation = lazy(() => import('./pages/EditReservation'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LoginPage = lazy(() => import('./pages/AuthPages').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/AuthPages').then(m => ({ default: m.RegisterPage })));
function Layout(){return <><Header/><Suspense fallback={<div className="page-loading">Setting the table…</div>}><Outlet/></Suspense><Footer/></>}
export default function App(){return <AuthProvider><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="/restaurant/:id" element={<RestaurantDetail/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route path="/my-reservations" element={<ProtectedRoute><Reservations/></ProtectedRoute>}/><Route path="/reservation/:id/edit" element={<ProtectedRoute><EditReservation/></ProtectedRoute>}/><Route path="/confirmation" element={<ProtectedRoute><Confirmation/></ProtectedRoute>}/><Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>}/><Route path="*" element={<NotFound/>}/></Route></Routes></AuthProvider>}
