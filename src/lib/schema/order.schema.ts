import { z } from 'zod'

export const GetCostSchema = z.object({
  destination: z.string().min(1, 'Destination Id is required'),
  weight: z.number().min(1, 'Weight is required'),
  courier: z.enum(['jne', 'pos', 'tiki', 'jnt', 'sicepat', 'ninja'])
})

export const CheckoutSchema = z.object({
  addressId: z.string().min(1, 'Address Id is required'),
  courier: z.enum(['jne', 'pos', 'tiki', 'jnt', 'sicepat', 'ninja']),
  service: z.string().min(1, 'Service is required'),
  note: z.string().optional(),
  itemIds: z.array(z.string()).optional()
})

export type ShippingCostPayload = z.infer<typeof GetCostSchema>
export type CheckoutPayload = z.infer<typeof CheckoutSchema>
export type CourierType = z.infer<typeof GetCostSchema>['courier']