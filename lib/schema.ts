import { $Enums } from '@prisma/client';
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
  registrationNumber: z.string().optional(),
  phoneNumber: z.string(),
  address: z.string().optional(),
  user: z.object({
    connect: z.object({
      id: ObjectIdSchema
    })
  })
});

export const CustomerSchema = DatabaseRecordSchema.extend({
  name: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  address: z.string().optional(),
  businessId: z.string().optional(),
  business: z.object({
    connect: z.object({
      id: ObjectIdSchema
    })
  })
});

export const InvoiceSchema = DatabaseRecordSchema.extend({
  amount: z.number(),
  dueDate: z.string(),
  status: z.enum([$Enums.InvoiceStatus.PAID, $Enums.InvoiceStatus.UNPAID]),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    price: z.number(),
    total: z.number()
  })),
  businessId: z.string().optional(),
  business: z.object({
    connect: z.object({
      id: ObjectIdSchema
    })
  }),
  customerId: z.string().optional(),
  customer: z.object({
    connect: z.object({
      id: ObjectIdSchema
    })
  }),
  invoiceId: z.string()
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
