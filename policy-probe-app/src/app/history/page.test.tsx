import React from 'react';
import { render, screen, act } from '@testing-library/react';
import HistoryPage from './page';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('HistoryPage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders without crashing when localStorage has valid JSON', () => {
    const validData = [{ app_name: 'Test App', overall_score: 50, risk_level: 'Medium', analyzed_at: new Date().toISOString() }];
    localStorage.setItem('probe_history', JSON.stringify(validData));

    render(<HistoryPage />);
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('handles corrupted JSON in localStorage gracefully without crashing', () => {
    // Set corrupted JSON
    localStorage.setItem('probe_history', '{ corrupted json [');

    // Suppress console.error for expected parse error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Should render empty state instead of crashing
    render(<HistoryPage />);

    expect(screen.getByText('No forensic data yet')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
