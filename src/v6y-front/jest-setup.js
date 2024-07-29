import React from 'react';
import crypto from 'crypto';
import '@testing-library/jest-dom';

// Correction de l'issue https://stackoverflow.com/questions/52612122/how-to-use-jest-to-test-functions-using-crypto-or-window-mscrypto
Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});

jest.mock('uuid', () => ({
  v4: () => '123456',
}));

// Correction de l'issue https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // déprécié
    removeListener: jest.fn(), // déprécié
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
    width: '1280px',
    height: '720px',
    scrollWidth: 100,
    scrollLeft: 50,
    clientWidth: 50,
  }),
});
