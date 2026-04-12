import React from 'react';
import renderer from 'react-test-renderer';

import PlaceholderScreen from './PlaceholderScreen';

describe('PlaceholderScreen', () => {
  it('renders without crashing', () => {
    expect(() => renderer.create(<PlaceholderScreen name="Test Screen" />)).not.toThrow();
  });
});
