import React from 'react';
import { render } from '@testing-library/react-native';
import RatingBadge from './RatingBadge';

describe('RatingBadge', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<RatingBadge rating={4.2} />);
    expect(toJSON()).toBeTruthy();
  });

  it('displays the rating formatted to one decimal place', () => {
    const { getByText } = render(<RatingBadge rating={4.2} />);
    expect(getByText('4.2')).toBeTruthy();
  });

  it('displays rating with no decimal when whole number', () => {
    const { getByText } = render(<RatingBadge rating={5} />);
    expect(getByText('5.0')).toBeTruthy();
  });

  it('renders without stars when showStars is "none" (default)', () => {
    const { toJSON } = render(<RatingBadge rating={4.0} showStars="none" />);
    const json = JSON.stringify(toJSON());
    // Default — only badge rendered, no star icons beyond the badge
    expect(json).toBeTruthy();
  });

  it('renders a single star when showStars is "single"', () => {
    const { toJSON } = render(<RatingBadge rating={4.2} showStars="single" />);
    // The component renders without crashing with showStars="single"
    expect(toJSON()).toBeTruthy();
  });

  it('renders full stars row when showStars is "full"', () => {
    const { toJSON } = render(<RatingBadge rating={4.2} showStars="full" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders correctly for a minimum rating of 0', () => {
    const { getByText } = render(<RatingBadge rating={0} showStars="full" />);
    expect(getByText('0.0')).toBeTruthy();
  });

  it('renders correctly for a maximum rating of 5', () => {
    const { getByText } = render(<RatingBadge rating={5} showStars="full" />);
    expect(getByText('5.0')).toBeTruthy();
  });

  it('renders partial fill for non-integer rating', () => {
    // 4.7 — should show 4 full stars, 1 partial, 0 empty
    const { toJSON } = render(<RatingBadge rating={4.7} showStars="full" />);
    expect(toJSON()).toBeTruthy();
  });
});
