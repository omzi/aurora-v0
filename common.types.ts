export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
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
  category?: string;
  mobileNumber?: string;
  registrationNumber?: string;
  contactDetails?: string;
}

export interface Customer extends DatabaseRecord {
  name: string;
  email: string;
  businessId: string;
}

export type SuccessResponse<T> = {
  message: string;
  data: T;
}

export type ErrorResponse = {
  message: string;
  errors?: string[];
}
