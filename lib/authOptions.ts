import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '#/lib/prisma';

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'password' }
			},
			async authorize(credentials): Promise<User | null> {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Invalid credentials');
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email
					}
				});

				if (!user || !user?.password) {
					throw new Error('Invalid credentials');
				}

				const isCorrectPassword = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isCorrectPassword) {
					throw new Error('Invalid credentials');
				}

				return user;
			}
		})
	],
	debug: process.env.NODE_ENV === 'development',
	session: {
		strategy: 'jwt'
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/auth/sign-in',
		newUser: '/dashboard'
	},
	callbacks: {
		async signIn({ user }) {
			// Allow USER role through...
			if (user.role === 'USER') {
				return true;
			} else {
				// Return false to display a default error message
				return false;
				// Or you can return a URL to redirect to:
				// return '/unauthorized'
			}
		}
	}
};
