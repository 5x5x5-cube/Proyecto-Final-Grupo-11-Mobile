import React from 'react';
import { render } from '@testing-library/react-native';
import { ReactTestRendererJSON } from 'react-test-renderer';
import Brand from './Brand';
import { palette } from '../theme/palette';

describe('Brand', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Brand />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the brand name text parts', () => {
    const { getByText } = render(<Brand />);
    expect(getByText('Travel')).toBeTruthy();
  });

  it('uses primary color for nav variant', () => {
    const { toJSON } = render(<Brand variant="nav" />);
    const tree = toJSON() as ReactTestRendererJSON;
    expect(tree).toBeTruthy();
    const flatStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style.filter(Boolean))
      : tree.props.style;
    expect(flatStyle.color).toBe(palette.primary);
  });

  it('uses onSurface color for hero variant', () => {
    const { toJSON } = render(<Brand variant="hero" />);
    const tree = toJSON() as ReactTestRendererJSON;
    const flatStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style.filter(Boolean))
      : tree.props.style;
    expect(flatStyle.color).toBe(palette.onSurface);
  });

  it('applies custom size', () => {
    const { toJSON } = render(<Brand size={30} />);
    const tree = toJSON() as ReactTestRendererJSON;
    const flatStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style.filter(Boolean))
      : tree.props.style;
    expect(flatStyle.fontSize).toBe(30);
  });
});
