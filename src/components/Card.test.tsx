import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import Card from './Card';
import { palette } from '../theme/palette';

describe('Card', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Card>
        <Text>Card content</Text>
      </Card>
    );
    expect(getByText('Card content')).toBeTruthy();
  });

  it('applies default padding and marginBottom', () => {
    const { toJSON } = render(
      <Card>
        <Text>Default</Text>
      </Card>
    );
    const tree = toJSON();
    expect(tree).toBeTruthy();
    const flatStyle = Array.isArray(tree!.props.style)
      ? Object.assign({}, ...tree!.props.style.filter(Boolean))
      : tree!.props.style;
    expect(flatStyle.padding).toBe(16);
    expect(flatStyle.marginBottom).toBe(12);
  });

  it('applies custom padding', () => {
    const { toJSON } = render(
      <Card padding={24}>
        <Text>Custom padding</Text>
      </Card>
    );
    const tree = toJSON();
    const flatStyle = Array.isArray(tree!.props.style)
      ? Object.assign({}, ...tree!.props.style.filter(Boolean))
      : tree!.props.style;
    expect(flatStyle.padding).toBe(24);
  });

  it('applies custom marginBottom', () => {
    const { toJSON } = render(
      <Card marginBottom={20}>
        <Text>Custom margin</Text>
      </Card>
    );
    const tree = toJSON();
    const flatStyle = Array.isArray(tree!.props.style)
      ? Object.assign({}, ...tree!.props.style.filter(Boolean))
      : tree!.props.style;
    expect(flatStyle.marginBottom).toBe(20);
  });

  it('uses palette tokens for border and background', () => {
    const { toJSON } = render(
      <Card>
        <Text>Token check</Text>
      </Card>
    );
    const tree = toJSON();
    const flatStyle = Array.isArray(tree!.props.style)
      ? Object.assign({}, ...tree!.props.style.filter(Boolean))
      : tree!.props.style;
    expect(flatStyle.backgroundColor).toBe(palette.surface);
    expect(flatStyle.borderColor).toBe(palette.outlineVariant);
  });
});
