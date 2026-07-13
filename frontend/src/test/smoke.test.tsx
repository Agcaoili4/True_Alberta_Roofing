// This file represents a smoke test
// Ensure that the app renders without crashing and that the main heading is present

import { render,screen } from '@testing-library/react';
import { expect, test } from 'vitest';

test('reenders a heading', () => {
    render (<h1>True Alberta Roofing</h1>);
    expect(screen.getByRole('heading', { name: /true alberta roofing/i})).toBeInTheDocument();    
});