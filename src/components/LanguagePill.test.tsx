import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LanguagePill from './LanguagePill';

const mockSetLanguage = jest.fn();
let mockLanguage = 'ES';

jest.mock('../contexts/LocaleContext', () => ({
  useLocale: () => ({
    language: mockLanguage,
    setLanguage: mockSetLanguage,
  }),
}));

describe('LanguagePill', () => {
  beforeEach(() => {
    mockSetLanguage.mockClear();
    mockLanguage = 'ES';
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<LanguagePill />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders both language options', () => {
    const { getByText } = render(<LanguagePill />);
    expect(getByText('ES')).toBeTruthy();
    expect(getByText('EN')).toBeTruthy();
  });

  it('calls setLanguage when a pill is pressed', () => {
    const { getByText } = render(<LanguagePill />);
    fireEvent.press(getByText('EN'));
    expect(mockSetLanguage).toHaveBeenCalledWith('EN');
  });

  it('calls setLanguage with ES when ES is pressed', () => {
    const { getByText } = render(<LanguagePill />);
    fireEvent.press(getByText('ES'));
    expect(mockSetLanguage).toHaveBeenCalledWith('ES');
  });
});
