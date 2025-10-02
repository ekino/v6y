import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LanguageMenu } from './LanguageMenu';
import '@testing-library/jest-dom';

// Mocks for useTranslationProvider
let getLocaleMock: ReturnType<typeof vi.fn>;
let changeLocaleMock: ReturnType<typeof vi.fn>;

vi.mock('../../translation/useTranslationProvider', () => ({
  useTranslationProvider: () => ({
    getLocale: getLocaleMock,
    changeLocale: changeLocaleMock,
  }),
}));

describe('LanguageMenu', () => {
  beforeEach(() => {
    getLocaleMock = vi.fn(() => 'fr');
    changeLocaleMock = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the current language and flag', () => {
    render(<LanguageMenu />);
    const trigger = screen.getByLabelText('Language selector');
    expect(trigger).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
    const flag = screen.getByRole('img', { name: 'Français' });
    expect(flag).toHaveAttribute('src', expect.stringContaining('fr.png'));
  });

  it('shows the other language in the dropdown', () => {
    render(<LanguageMenu />);
    fireEvent.mouseDown(screen.getByLabelText('Language selector'));
    expect(screen.getByText('English')).toBeInTheDocument();
    const flag = screen.getByRole('img', { name: 'English' });
    expect(flag).toHaveAttribute('src', expect.stringContaining('gb.png'));
  });

  it('calls changeLocale when a new language is selected', () => {
    render(<LanguageMenu />);
    fireEvent.mouseDown(screen.getByLabelText('Language selector'));
    fireEvent.click(screen.getByText('English'));
    expect(changeLocaleMock).toHaveBeenCalledWith('en');
  });
});
