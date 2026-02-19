import { z } from 'zod'

export const AdminRegisterSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .max(70, 'Email must be less than 70 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
})

export const AdminLoginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .max(70, 'Email must be less than 70 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
})

export const AdminChangePasswordSchema = z.object({
  old_password: z.string().min(6, 'Old Password must be at least 6 characters'),
  new_password: z.string().min(6, 'New Password must be at least 6 characters')
})