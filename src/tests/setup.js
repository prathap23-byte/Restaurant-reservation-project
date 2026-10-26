import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Clear rendered React trees after every test so one test cannot affect another.
afterEach(() => {
  cleanup();
});
