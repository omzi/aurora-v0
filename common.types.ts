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
};

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
	paymentLink?: string;
}

export type SuccessResponse<T> = {
	message: string;
	data: T;
};

export type ErrorResponse = {
	message: string;
	errors?: string[];
};

export type DashboardAnalyticsResponse = {
	customers: {
		count: string;
		monthlyPercentageChange: string;
	};
	revenue: {
		amount: string;
		monthlyPercentageChange: string;
	};
	outstanding: {
		amount: string;
		monthlyPercentageChange: string;
	};
	withdrawals: {
		amount: string;
		monthlyPercentageChange: string;
	};
};

export type DashboardChartResponse = {
  [key: string]: string | number;
}[];

export type SelectedInvoiceFields = Pick<Invoice, 'id' | 'invoiceId' | 'amount' | 'dueDate' | 'status'>

export type GetCustomerResponse = {
	customer: Customer;
	invoices: SelectedInvoiceFields[];
	stats: {
		paid: {
			amount: string;
			monthlyPercentageChange: string;
		};
		unpaid: {
			amount: string;
			monthlyPercentageChange: string;
		};
		chart: {
			month: string;
			paid: number;
			unpaid: number;
		}[];
	}
}

interface PaystackBaseResponse {
	status: boolean;
	message: string;
}
export interface PaystackInitializeResponse extends PaystackBaseResponse {
	data: {
		authorization_url: string;
		access_code: string;
		reference: string;
	};
}

export interface PaystackVerifyResponse extends PaystackBaseResponse {
	data: {
		status: 'abandoned' | 'success';
		reference: string;
		amount: number;
	};
}

export interface PaystackWebhookResponse {
	event: 'charge.success';
	data: {
		status: 'abandoned' | 'success';
		reference: string;
		amount: number;
		metadata: {
			businessName: string;
			businessEmail: string;
			customerName: string;
			customerEmail: string;
		};
	};
}
