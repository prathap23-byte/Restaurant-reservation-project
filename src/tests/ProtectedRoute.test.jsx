import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import { store } from '../store/store';
describe('project setup',()=>{it('creates a Redux store with expected slices',()=>{expect(store.getState()).toHaveProperty('auth');expect(store.getState()).toHaveProperty('reservations');expect(store.getState()).toHaveProperty('restaurants')})});
