import * as z from 'zod';
import validator from 'validator';

export const UserSchema = z.object({
  email: z.string()
    .optional()
    .refine(value => value && value.length > 0, 'Your email address is required')
    .refine(value => value && validator.isEmail(value), { message: 'Invalid email address' }),
  password: z.string()
    .optional()
    .refine(value => value && value.length > 0, 'Your password is required')
    .refine(value => {
      return value && value.length >= 8 && /\d/.test(value) && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    }, {
      message: 'Password must have at least one lowercase character, one uppercase character, one digit, one special character, and be at least 8 characters long',
    }),
  firstName: z.string()
    .optional()
    .refine(value => value && value.length > 0, 'Your first name is required')
    .refine(value => value && value.length >= 2, 'First name must be at least 2 characters.')
    .refine(value => value && value.length <= 30, 'First name must not be more than 30 characters.'),
  lastName: z.string()
    .optional()
    .refine(value => value && value.length > 0, 'Your last name is required')
    .refine(value => value && value.length >= 2, 'Last name must be at least 2 characters.')
    .refine(value => value && value.length <= 30, 'Last name must not be more than 30 characters.'),
  username: z.string()
    .optional()
    .refine(value => value && value.length > 0, 'Your username is required')
    .refine(value => value && value.length >= 4, 'Username must be at least 4 characters.')
    .refine(value => value && value.length <= 24, 'Username must not be more than 24 characters.'),
  bio: z.string()
    .optional()
    .refine(value => value && value.length > 0, 'Your bio is required')
    .refine(value => value && value.length >= 10, 'Bio must be at least 10 characters.')
    .refine(value => value && value.length <= 512, 'Bio must not be more than 512 characters.'),
  image: z.string().url().nonempty(),
  isOnboarded: z.boolean().default(false)
});

export const SignUpSchema = UserSchema.pick({
  firstName: true,
  lastName: true,
  password: true,
  email: true
});

export const BusinessSchema = z.object({
  name: z.string()
    .refine(value => value && value.length > 0, 'Business name is required')
    .refine(value => value && value.length <= 100, 'Business name must not be more than 100 characters.'),
  logo: z.string().optional(),
  description: z.string()
    .refine(value => value && value.length > 0, 'Business description is required')
    .refine(value => value && value.length <= 500, 'Business description must not be more than 500 characters.'),
  contactDetails: z.string()
    .refine(value => value && value.length > 0, 'Contact details are required')
    .refine(value => value && value.length <= 200, 'Contact details must not be more than 200 characters.').optional()
}).refine(data => Object.keys(data).length > 0, 'At least one field is required');
