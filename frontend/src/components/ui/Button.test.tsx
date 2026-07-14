import { render, screen } from '@testing-library/react';
import { expect, test} from 'vitest';
import { Button } from './Button';

test('renders as a link with the right href and primary styling when href is given', () => {
    render(<Button href="/contact">Free Estimate</Button>);
    const el = screen.getByRole('link', {name: /free estimate/i });
    expect(el).toHaveAttribute('href', '/contact');
    expect(el.className).toMatch(/bg-steel/);
})