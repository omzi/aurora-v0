import { NextResponse } from 'next/server';

import bcrypt from 'bcrypt';
import * as z from 'zod';

import prisma from '#/lib/prisma';
import { SignUpSchema } from '#/lib/validations';

const POST = async (request: Request) => {
	const body = await request.json();

	try {
		const data = SignUpSchema.parse(body) as Required<z.infer<typeof SignUpSchema>>;
    
		// Check if the email already exists
		const existingUser = await prisma.user.findUnique({
			where: {
				email: data.email
			}
		});

		if (existingUser) {
			// Email is already registered, return a conflict response
			return NextResponse.json({ message: 'Email is already registered. Please use a different email.' }, { status: 409 });
		}

		const hashedPassword = await bcrypt.hash(data.password, 12);

		const user = await prisma.user.create({
			data: {
				email: data.email,
				name: `${data.firstName} ${data.lastName}`,
				password: hashedPassword
			}
		});

		// If everything goes well, return a success response
		return NextResponse.json({ message: 'User registered successfully!', user }, { status: 201 });
	} catch (error) {
		console.log('Registeration Error :>>', error);
		if (error instanceof z.ZodError) {
			// Return validation error messages
			return NextResponse.json({ message: 'A validation error occurred', errors: error.formErrors.fieldErrors }, { status: 400 });
		} else {
			// Handle other types of errors (e.g. database errors)
			return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
		}
	}
}

export { POST };
