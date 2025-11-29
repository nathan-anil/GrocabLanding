import { z } from 'zod';

/**
 * Email validation schema using Zod
 * Validates email format and ensures it's a string
 */
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
});

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns Object with success status and either data or error message
 */
export function validateEmail(email: string): {
  success: boolean;
  data?: string;
  error?: string;
} {
  try {
    const result = emailSchema.parse({ email });
    return { success: true, data: result.email };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Invalid email address',
      };
    }
    return { success: false, error: 'Invalid email address' };
  }
}

