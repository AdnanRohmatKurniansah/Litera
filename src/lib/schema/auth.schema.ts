import { z } from 'zod'

export const UserRegisterSchema = z.object({
  email: z.email()
    .min(1, 'Email is required')
    .max(150, 'Email must be less than 150 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
})

export const UserLoginSchema = z.object({
  email: z.email()
    .min(1, 'Email is required')
    .max(150, 'Email must be less than 150 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
})

export const UserProfileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150).optional(),
  phone: z.string().max(30, 'Max Character 30').optional()
})

export const UserChangePasswordSchema = z.object({
  old_password: z.string().min(6, 'Old Password must be at least 6 characters'),
  new_password: z.string().min(6, 'New Password must be at least 6 characters')
})

export type UserRegisterInput = z.infer<typeof UserRegisterSchema>
export type UserLoginInput = z.infer<typeof UserLoginSchema>
export type UserProfileUpdateInput = z.infer<typeof UserProfileUpdateSchema>
export type UserChangePasswordInput = z.infer<typeof UserChangePasswordSchema>