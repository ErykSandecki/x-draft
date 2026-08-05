import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

// components
import App from './App';

describe('App', () => {
  it('renders the heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'x-draft' })).toBeInTheDocument();
  });

  it('toggles the theme attribute when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const initialTheme = document.documentElement.dataset.theme;
    const button = screen.getByRole('button', { name: /switch to/i });

    await user.click(button);

    expect(document.documentElement.dataset.theme).not.toBe(initialTheme);
  });
});
