import { describe, it, expect } from 'vitest';
import { getWinner } from './page';

describe('getWinner', () => {
  describe('direction: bool', () => {
    it('should return Tie when both values are the same', () => {
      expect(getWinner(true, true, 'bool')).toBe('Tie');
      expect(getWinner(false, false, 'bool')).toBe('Tie');
    });

    it('should return A when valA is true and valB is false', () => {
      expect(getWinner(true, false, 'bool')).toBe('A');
    });

    it('should return B when valA is false and valB is true', () => {
      expect(getWinner(false, true, 'bool')).toBe('B');
    });
  });

  describe('direction: higher', () => {
    it('should return Tie when both values are equal', () => {
      expect(getWinner(10, 10, 'higher')).toBe('Tie');
      expect(getWinner('10', '10', 'higher')).toBe('Tie');
    });

    it('should return A when valA is greater than valB', () => {
      expect(getWinner(20, 10, 'higher')).toBe('A');
      expect(getWinner('20', 10, 'higher')).toBe('A');
    });

    it('should return B when valA is less than valB', () => {
      expect(getWinner(5, 10, 'higher')).toBe('B');
    });
  });

  describe('direction: lower', () => {
    it('should return Tie when both values are equal', () => {
      expect(getWinner(5, 5, 'lower')).toBe('Tie');
    });

    it('should return A when valA is less than valB', () => {
      expect(getWinner(2, 5, 'lower')).toBe('A');
    });

    it('should return B when valA is greater than valB', () => {
      expect(getWinner(10, 5, 'lower')).toBe('B');
    });
  });
});
