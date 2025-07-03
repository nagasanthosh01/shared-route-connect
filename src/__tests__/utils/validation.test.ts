
import { z } from 'zod';

// Test schema validation utilities
const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

describe('Validation Utilities', () => {
  describe('Email validation', () => {
    it('validates correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
      ];
      
      validEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });

    it('rejects invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
      ];
      
      invalidEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });
  });

  describe('Password validation', () => {
    it('validates passwords with minimum length', () => {
      const validPasswords = [
        'password123',
        'securepass',
        '123456',
      ];
      
      validPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password)).not.toThrow();
      });
    });

    it('rejects passwords that are too short', () => {
      const invalidPasswords = [
        '123',
        'pass',
        'ab',
        '',
      ];
      
      invalidPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password)).toThrow();
      });
    });
  });
});
