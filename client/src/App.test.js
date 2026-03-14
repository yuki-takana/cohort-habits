import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app', () => {
  render(<App />);
  // This just checks if the text "Home Page" is on the screen
  const homeElement = screen.getByText(/Home Page/i);
  expect(homeElement).toBeInTheDocument();
});