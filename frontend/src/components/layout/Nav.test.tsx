import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { Nav } from './Nav';

test('mobile menu toggles open when the hamburger is clicked', async () => {
  render(<Nav />);
  const button = screen.getByRole('button', { name: /menu/i });

  // Closed to start...
  expect(button).toHaveAttribute('aria-expanded', 'false');

  // ...and open after a click.
  await userEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
});
