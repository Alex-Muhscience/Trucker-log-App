import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LogForm from '../components/LogForm/LogForm';

test('renders LogForm component', () => {
  render(<LogForm />);
  const currentLocationInput = screen.getByPlaceholderText(/current location/i);
  expect(currentLocationInput).toBeInTheDocument();
});

test('validates required fields', () => {
  render(<LogForm />);
  fireEvent.click(screen.getByText(/submit/i));

  const errors = screen.getAllByText(/required/i);
  expect(errors).toHaveLength(4);
});