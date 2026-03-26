import React from 'react';
import { render } from '@testing-library/react-native';
import Text from '../Text';
import { palette } from '../../theme/palette';
import { typography } from '../../theme/typography';

describe('Text', () => {
  it('renders children text', () => {
    const { getByText } = render(<Text>Hello world</Text>);
    expect(getByText('Hello world')).toBeTruthy();
  });

  it('applies default variant (body) styles', () => {
    const { getByText } = render(<Text>Default variant</Text>);
    const element = getByText('Default variant');
    const flatStyle = Array.isArray(element.props.style)
      ? Object.assign({}, ...element.props.style.filter(Boolean))
      : element.props.style;
    expect(flatStyle.fontSize).toBe(typography.body.fontSize);
    expect(flatStyle.lineHeight).toBe(typography.body.lineHeight);
  });

  it('applies default color (onSurface)', () => {
    const { getByText } = render(<Text>Default color</Text>);
    const element = getByText('Default color');
    const flatStyle = Array.isArray(element.props.style)
      ? Object.assign({}, ...element.props.style.filter(Boolean))
      : element.props.style;
    expect(flatStyle.color).toBe(palette.onSurface);
  });

  it('applies custom variant', () => {
    const { getByText } = render(<Text variant="h1">Heading</Text>);
    const element = getByText('Heading');
    const flatStyle = Array.isArray(element.props.style)
      ? Object.assign({}, ...element.props.style.filter(Boolean))
      : element.props.style;
    expect(flatStyle.fontSize).toBe(typography.h1.fontSize);
    expect(flatStyle.lineHeight).toBe(typography.h1.lineHeight);
  });

  it('applies custom color', () => {
    const { getByText } = render(<Text color={palette.primary}>Colored</Text>);
    const element = getByText('Colored');
    const flatStyle = Array.isArray(element.props.style)
      ? Object.assign({}, ...element.props.style.filter(Boolean))
      : element.props.style;
    expect(flatStyle.color).toBe(palette.primary);
  });

  it('applies custom variant and color together', () => {
    const { getByText } = render(
      <Text variant="caption" color={palette.error}>
        Caption error
      </Text>
    );
    const element = getByText('Caption error');
    const flatStyle = Array.isArray(element.props.style)
      ? Object.assign({}, ...element.props.style.filter(Boolean))
      : element.props.style;
    expect(flatStyle.fontSize).toBe(typography.caption.fontSize);
    expect(flatStyle.color).toBe(palette.error);
  });
});
