import * as z from 'zod';

const ObjectIdSchema = z.string().optional();

export const DatabaseRecordSchema = z.object({
  id: ObjectIdSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const BusinessSchema = DatabaseRecordSchema.extend({
  name: z.string(),
  logo: z.string().optional(),
  description: z.string(),
  email: z.string(),
  registrationNumber: z.string(),
  category: z.string(),
  mobileNumber: z.string(),
  contactDetails: z.string().optional(),
  user: z.object({
    connect: z.object({
      id: ObjectIdSchema
    })
  })
});

export const CustomerSchema = DatabaseRecordSchema.extend({
  name: z.string(),
  email: z.string(),
  businessId: z.string().optional(),
  business: z.object({
    connect: z.object({
      id: ObjectIdSchema
    })
  })
});

export const WithdrawalSchema = DatabaseRecordSchema.extend({
  userId: z.string(),
  withdrawalId: z.string(),
  amount: z.number(),
  status: z.string().optional(),
  user: z.object({
    connect: z.object({
      id: ObjectIdSchema
    }),
  }).optional()
});
