import { ValidationError } from './errors';

export function validateEmail(email: string): void {
  if (!email) {
    throw new ValidationError('Email is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Please enter a valid email address');
  }
}