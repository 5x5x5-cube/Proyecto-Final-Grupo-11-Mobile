import React from 'react';
import { render } from '@testing-library/react-native';
import Divider from './Divider';
import { palette } from '../theme/palette';

describe('Divider', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Divider />);
    expect(toJSON()).toBeTruthy();
  });

  it('has height of 1 and uses palette outlineVariant color', () => {
    const { toJSON } = render(<Divider />);
    const tree = toJSON();
    const flatStyle = Array.isArray(tree!.props.style)
      ? Object.assign({}, ...tree!.props.style.filter(Boolean))
      : tree!.props.style;
    expect(flatStyle.height).toBe(1);
    expect(flatStyle.backgroundColor).toBe(palette.outlineVariant);
  });
});
