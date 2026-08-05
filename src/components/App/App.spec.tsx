import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

// components
import App from './App';

describe('App snapshots', () => {
  it('should render App', () => {
    // before
    const { asFragment } = render(<App />);

    // result
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('App behaviors', () => {
  it('should toggle the theme attribute when the button is clicked', async () => {
    // mock
    const user = userEvent.setup();

    // before
    render(<App />);
    const initialTheme = document.documentElement.dataset.theme;

    // find
    const button = screen.getByRole('button', { name: /switch to/i });

    // action
    await user.click(button);

    // result
    expect(document.documentElement.dataset.theme).not.toBe(initialTheme);
  });
});
