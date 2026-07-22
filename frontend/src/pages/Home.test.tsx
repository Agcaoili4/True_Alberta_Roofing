// This is a regression guard for if someone delets a section

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect,test } from 'vitest'
import { Home } from './Home'
import { site } from '../content/site'

test('home renders the hero headline and the trust section', () => {
    render(<Home />, { wrapper: MemoryRouter });
    expect(screen.getByRole('heading', { name: site.hero.headline })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /why trust/i })).toBeInTheDocument();
});