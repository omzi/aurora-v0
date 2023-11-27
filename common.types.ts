import { $Enums } from '@prisma/client';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export type Item = {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface DatabaseRecord {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Business extends DatabaseRecord {
  name: string;
  logo: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  registrationNumber?: string;
  address?: string;
}

export interface Customer extends DatabaseRecord {
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  businessId: string;
}

export interface Invoice extends DatabaseRecord {
  amount: number;
  dueDate: string;
  status: $Enums.InvoiceStatus;
  items: Item[];
  address?: string;
  businessId: string;
  customerId: string;
  invoiceId: string;
}

export type SuccessResponse<T> = {
  message: string;
  data: T;
}

export type ErrorResponse = {
  message: string;
  errors?: string[];
}
