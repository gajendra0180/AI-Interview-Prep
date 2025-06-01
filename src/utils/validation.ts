import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Registration validation schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Interview preferences validation schema
export const preferenceSchema = z.object({
  experienceLevel: z.string().min(1, 'Please select your experience level'),
  focusArea: z.enum(['DSA', 'System Design', 'Core Fundamentals'], {
    errorMap: () => ({ message: 'Please select a focus area' }),
  }),
  interviewerGender: z.enum(['Male', 'Female'], {
    errorMap: () => ({ message: 'Please select interviewer gender preference' }),
  }),
  programmingLanguage: z.string().optional(),
}).refine(data => {
  // If focus area is DSA, programming language is required
  if (data.focusArea === 'DSA' && !data.programmingLanguage) {
    return false;
  }
  return true;
}, {
  message: 'Please select a programming language for DSA focus',
  path: ['programmingLanguage'],
}); 