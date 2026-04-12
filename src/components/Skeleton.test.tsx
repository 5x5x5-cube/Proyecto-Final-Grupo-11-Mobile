import React from 'react';
import { render } from '@testing-library/react-native';
import Skeleton from './Skeleton';

describe('Skeleton', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Skeleton />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with default height', () => {
    const { toJSON } = render(<Skeleton />);
    const tree = toJSON() as any;
    expect(tree).toBeTruthy();
    const flatStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style.filter(Boolean))
      : tree.props.style;
    expect(flatStyle.height).toBe(16);
  });

  it('renders with custom height', () => {
    const { toJSON } = render(<Skeleton height={80} />);
    const tree = toJSON() as any;
    const flatStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style.filter(Boolean))
      : tree.props.style;
    expect(flatStyle.height).toBe(80);
  });

  it('renders with custom width', () => {
    const { toJSON } = render(<Skeleton width={200} />);
    const tree = toJSON() as any;
    const flatStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style.filter(Boolean))
      : tree.props.style;
    expect(flatStyle.width).toBe(200);
  });

  it('renders with custom borderRadius', () => {
    const { toJSON } = render(<Skeleton borderRadius={8} />);
    const tree = toJSON() as any;
    const flatStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style.filter(Boolean))
      : tree.props.style;
    expect(flatStyle.borderRadius).toBe(8);
  });
});
