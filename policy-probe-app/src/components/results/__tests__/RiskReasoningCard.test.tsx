import React from 'react';
import { render, screen, within } from '@testing-library/react';
import RiskReasoningCard from '../RiskReasoningCard';
import { RiskReason } from '@/lib/types';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

const mockReasons: RiskReason[] = [
  {
    factor: 'Data Minimization',
    impact: 'Positive',
    weight: 15,
    explanation: 'Collects only necessary data.',
    evidence_snippet: 'We only collect what is needed.',
  },
  {
    factor: 'Third-party Sharing',
    impact: 'Negative',
    weight: 20,
    explanation: 'Shares data with unknown affiliates.',
    evidence_snippet: 'Data may be shared with partners.',
  },
  {
    factor: 'Vague Retention',
    impact: 'Neutral',
    weight: 5,
    explanation: 'Unclear retention policy.',
  },
];

describe('RiskReasoningCard', () => {
  it('renders correctly with multiple reasons', () => {
    renderWithTheme(<RiskReasoningCard reasons={mockReasons} overallScore={60} />);

    expect(screen.getByText('Risk & Logic Breakdown')).toBeInTheDocument();
    expect(screen.getByText(/This score is derived from 3 weighted factors./)).toBeInTheDocument();

    // Check if the factors are displayed
    expect(screen.getByText('Data Minimization')).toBeInTheDocument();
    expect(screen.getByText('Third-party Sharing')).toBeInTheDocument();
    expect(screen.getByText('Vague Retention')).toBeInTheDocument();

    // Check explanations
    expect(screen.getByText('Collects only necessary data.')).toBeInTheDocument();
    expect(screen.getByText('Shares data with unknown affiliates.')).toBeInTheDocument();

    // Check evidence snippet
    expect(screen.getByText('“We only collect what is needed.”')).toBeInTheDocument();
  });

  it('sorts reasons by weight descending', () => {
    const { container } = renderWithTheme(<RiskReasoningCard reasons={mockReasons} overallScore={60} />);

    // Find the container holding the reasons.
    // The title uses variant="body1"? No, the title uses a specific style. The factors use variant="body1"
    const factors = Array.from(container.querySelectorAll('.MuiTypography-body1')).map(el => el.textContent);

    // Filter out the title if it somehow matches (the title is "Risk & Logic Breakdown" but it does not use body1, wait)
    // Actually just target the factors directly by checking their text.
    const textNodes = Array.from(container.querySelectorAll('.MuiTypography-body1')).map(el => el.textContent).filter(text => text !== 'Risk & Logic Breakdown' && text !== '');

    // Sort order: weight 20, 15, 5
    expect(textNodes[0]).toBe('Third-party Sharing');
    expect(textNodes[1]).toBe('Data Minimization');
    expect(textNodes[2]).toBe('Vague Retention');
  });

  it('displays correct summary text when negative outweighs positive', () => {
    // 1 negative, 1 positive in mockReasons
    // wait, pos = 1, neg = 1 in mockReasons.
    // The component checks `neg > pos`. So 1 > 1 is false.
    // So the text should be "Positive compliance indicators mostly support this score."
    renderWithTheme(<RiskReasoningCard reasons={mockReasons} overallScore={60} />);
    expect(screen.getByText(/Positive compliance indicators mostly support this score./)).toBeInTheDocument();
  });

  it('displays correct summary text when strictly negative > positive', () => {
    const moreNegativeReasons: RiskReason[] = [
      ...mockReasons,
      {
        factor: 'Another negative',
        impact: 'Negative',
        weight: 10,
        explanation: 'Bad'
      }
    ];
    renderWithTheme(<RiskReasoningCard reasons={moreNegativeReasons} overallScore={60} />);
    expect(screen.getByText(/Negative risk drivers outweigh strengths — caution advised./)).toBeInTheDocument();
  });

  it('renders correctly with empty reasons', () => {
    renderWithTheme(<RiskReasoningCard reasons={[]} overallScore={80} />);
    expect(screen.getByText(/This score is derived from 0 weighted factors./)).toBeInTheDocument();
    expect(screen.getByText(/Positive compliance indicators mostly support this score./)).toBeInTheDocument();
  });

  it('displays proper chip values and signs based on impact', () => {
    renderWithTheme(<RiskReasoningCard reasons={mockReasons} overallScore={60} />);

    expect(screen.getByText('+15%')).toBeInTheDocument();
    expect(screen.getByText('-20%')).toBeInTheDocument();
    expect(screen.getByText('-5%')).toBeInTheDocument(); // The component uses `r.impact === 'Positive' ? \`+\${r.weight}%\` : \`-\${r.weight}%\``
  });
});
