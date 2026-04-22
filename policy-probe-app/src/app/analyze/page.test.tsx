import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalyzePage from './page';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('AnalyzePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays an error alert when the API call fails', async () => {
    // Mock fetch to reject with an error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error occurred'));

    render(<AnalyzePage />);

    // Enter a value so the button is enabled
    const input = screen.getByPlaceholderText(/e.g. Google Classroom/i);
    fireEvent.change(input, { target: { value: 'Test App' } });

    // Click the analyze button
    const button = screen.getByRole('button', { name: /Commence Analysis/i });
    fireEvent.click(button);

    // Assert that the error message appears
    await waitFor(() => {
      expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    });
  });

  it('displays API error message when response is not ok', async () => {
    // Mock fetch to return a failed response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid policy URL' }),
    });

    render(<AnalyzePage />);

    const input = screen.getByPlaceholderText(/e.g. Google Classroom/i);
    fireEvent.change(input, { target: { value: 'Test App' } });

    const button = screen.getByRole('button', { name: /Commence Analysis/i });
    fireEvent.click(button);

    // Assert that the error message appears
    await waitFor(() => {
      expect(screen.getByText('Invalid policy URL')).toBeInTheDocument();
    });
  });

  it('displays default error message if API error is empty', async () => {
    // Mock fetch to return a failed response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}), // No error message in response
    });

    render(<AnalyzePage />);

    const input = screen.getByPlaceholderText(/e.g. Google Classroom/i);
    fireEvent.change(input, { target: { value: 'Test App' } });

    const button = screen.getByRole('button', { name: /Commence Analysis/i });
    fireEvent.click(button);

    // Assert that the error message appears
    await waitFor(() => {
      expect(screen.getByText('Analysis failed')).toBeInTheDocument();
    });
  });
});
