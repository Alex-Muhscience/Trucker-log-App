import React from 'react';
import { render, screen } from '@testing-library/react';
import MapComponent from '../components/MapComponent/MapComponent';

test('renders MapComponent component', () => {
  render(<MapComponent />);
  const mapElement = screen.getByTestId('map');
  expect(mapElement).toBeInTheDocument();
});