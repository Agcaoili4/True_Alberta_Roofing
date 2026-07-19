import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import { Nav } from './Nav';

// Nav now uses <Link>, which needs a router in the tree — MemoryRouter provides one.
test('mobile menu toggles open when the hamburger is clicked', async () => {
  render(<Nav />, { wrapper: MemoryRouter });
  const button = screen.getByRole('button', { name: /menu/i });

  expect(button).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
});
