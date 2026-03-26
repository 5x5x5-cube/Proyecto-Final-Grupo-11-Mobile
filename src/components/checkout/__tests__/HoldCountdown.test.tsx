jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
  }),
}));

import React from 'react';
import { render, act } from '@testing-library/react-native';
import HoldCountdown from '../HoldCountdown';

function expiresInSeconds(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('HoldCountdown', () => {
  it('renders countdown in MM:SS format', () => {
    const expiresAt = expiresInSeconds(5 * 60 + 30); // 5:30
    const { getByText } = render(<HoldCountdown expiresAt={expiresAt} onExpired={jest.fn()} />);
    expect(getByText(/05:3[0-9]/)).toBeTruthy();
  });

  it('calls onExpired when countdown reaches zero', () => {
    const onExpired = jest.fn();
    const expiresAt = expiresInSeconds(2);

    render(<HoldCountdown expiresAt={expiresAt} onExpired={onExpired} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onExpired).toHaveBeenCalledTimes(1);
  });

  it('returns null when already expired', () => {
    const expiresAt = expiresInSeconds(-10);
    const { toJSON } = render(<HoldCountdown expiresAt={expiresAt} onExpired={jest.fn()} />);
    expect(toJSON()).toBeNull();
  });

  it('applies warning styling when less than 2 minutes remaining', () => {
    const { palette } = jest.requireActual('../../../theme/palette') as {
      palette: Record<string, string>;
    };

    const expiresAt = expiresInSeconds(90); // 1:30, under 2 min
    const { UNSAFE_getByType } = render(
      <HoldCountdown expiresAt={expiresAt} onExpired={jest.fn()} />
    );

    const { View } = jest.requireActual('react-native') as typeof import('react-native');
    const container = UNSAFE_getByType(View);
    const flatStyle = Array.isArray(container.props.style)
      ? Object.assign({}, ...container.props.style.filter(Boolean))
      : container.props.style;

    expect(flatStyle.backgroundColor).toBe(palette.warningContainer);
  });

  it('does not apply warning styling when more than 2 minutes remaining', () => {
    const { palette } = jest.requireActual('../../../theme/palette') as {
      palette: Record<string, string>;
    };

    const expiresAt = expiresInSeconds(3 * 60); // 3 min
    const { UNSAFE_getByType } = render(
      <HoldCountdown expiresAt={expiresAt} onExpired={jest.fn()} />
    );

    const { View } = jest.requireActual('react-native') as typeof import('react-native');
    const container = UNSAFE_getByType(View);
    const flatStyle = Array.isArray(container.props.style)
      ? Object.assign({}, ...container.props.style.filter(Boolean))
      : container.props.style;

    expect(flatStyle.backgroundColor).toBe(palette.primaryContainer);
  });
});
