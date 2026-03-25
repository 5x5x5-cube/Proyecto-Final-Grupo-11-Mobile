import { palette } from '../palette';

describe('palette', () => {
  it('should export all required color tokens', () => {
    expect(palette.primary).toBeDefined();
    expect(palette.onPrimary).toBeDefined();
    expect(palette.surface).toBeDefined();
    expect(palette.onSurface).toBeDefined();
    expect(palette.error).toBeDefined();
  });

  it('should have valid hex color values', () => {
    Object.values(palette).forEach(color => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
