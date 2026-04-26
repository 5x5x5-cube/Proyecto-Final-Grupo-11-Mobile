import { isValidLuhn } from './luhn';

describe('isValidLuhn', () => {
  it('validates the 4242 test card', () => {
    expect(isValidLuhn('4242424242424242')).toBe(true);
  });

  it('validates the decline test card', () => {
    expect(isValidLuhn('4000000000000002')).toBe(true);
  });

  it('rejects a random 16-digit number', () => {
    expect(isValidLuhn('1233233234324323')).toBe(false);
  });

  it('rejects too-short input', () => {
    expect(isValidLuhn('42424242')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidLuhn('')).toBe(false);
  });
});
