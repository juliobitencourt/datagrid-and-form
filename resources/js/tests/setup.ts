import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Assure that the matchers are loaded correctly
// This is necessary to extend Vitest's expect with the matchers from jest-dom
if (matchers) {
    expect.extend(matchers);
} else {
    console.error('Error loading @testing-library/jest-dom/matchers');
}
