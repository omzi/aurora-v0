'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Loader from 'react-ts-loaders';
import { zodResolver } from '@hookform/resolvers/zod';
import { AtSignIcon, KeyIcon, UserIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import * as z from 'zod';

import AuthSocialButton from '#/components/AuthSocialButton';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '#/components/ui/form';
import { Input } from '#/components/ui/input';
import { SignUpSchema } from '#/lib/validations';

const SignUp = () => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);
	const form = useForm<z.infer<typeof SignUpSchema>>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			password: '',
			email: ''
		}
	});
	const { handleSubmit } = form;

	const socialAction = async (action: 'google') => {
		return;
		// eslint-disable-next-line no-unreachable
		setIsSubmitting(true);
		setGoogleLoading(true);

		try {
			const callback = await signIn(action, { redirect: false });
			if (callback?.error) toast.error('Invalid credentials!');

			if (callback?.ok) {
				form.reset();
				router.push('/dashboard');
			}
		} catch (error: any) {
			console.error('Sign-Up Error :>>', error);
			toast.error(error.message ?? 'An error occurred during sign up');
		} finally {
			setIsSubmitting(false);
			setGoogleLoading(false);
		}
	};

	const onSubmit = (data: any) => {
		console.log('Sign-Up Data :>>', data);
		signUpUser(data);
	};

	const signUpUser = async (data: Required<z.infer<typeof SignUpSchema>>) => {
		setIsSubmitting(true);
		setGoogleLoading(true);

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			if (!response.ok) throw new Error('Network response was not ok');
			await response.json();

			toast.success('Account created successfully!');

			const callback = await signIn('credentials', {
				...data,
				redirect: false
			});
			if (callback?.error) toast.error('Invalid credentials!');

			if (callback?.ok) {
				form.reset();
				router.push('/dashboard');
			}
		} catch (error: any) {
			console.error('Sign-Up Error :>>', error);
			toast.error(error.message ?? 'An error occurred during sign up');
		} finally {
			setIsSubmitting(false);
			setGoogleLoading(false);
		}
	};

	return (
		<div className="flex flex-col justify-center w-full min-h-full py-12 px-4 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<Link href={'/'}>
					<Image
						className="mx-auto"
						src={'/images/logo.png'}
						height={48}
						width={48}
						alt="Aurora"
						fetchPriority="high"
					/>
				</Link>
				<h2 className="mt-6 text-2xl font-bold text-center text-dark-2 dark:text-light-2">
					Create your Aurora account
				</h2>
				<p className="mt-2 text-sm text-center text-gray-600">
					Or,{' '}
					<Link
						href={'/auth/sign-in'}
						className="font-medium text-blue-600 hover:text-blue-500"
					>
						sign in to your account
					</Link>
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="px-4 py-8 shadow bg-light-2/25 dark:bg-dark-2 sm:rounded-lg sm:px-10">
					<Form {...form}>
						<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* First Name */}
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel
												htmlFor={field.name}
												className="text-base-semibold text-dark-2 dark:text-light-2"
											>
												First Name
											</FormLabel>
											<FormControl>
												<div className="relative rounded-md shadow-sm">
													<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
														<UserIcon
															className="w-5 h-5 text-gray-400"
															aria-hidden="true"
														/>
													</div>
													<Input
														type="text"
														disabled={isSubmitting}
														id={field.name}
														placeholder="Your first name"
														autoComplete="given-name"
														className="account-form-input block w-full rounded-md border-0 py-1.5 pl-10"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>

								{/* Last Name */}
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel
												htmlFor={field.name}
												className="text-base-semibold text-dark-2 dark:text-light-2"
											>
												Last Name
											</FormLabel>
											<FormControl>
												<div className="relative rounded-md shadow-sm">
													<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
														<UserIcon
															className="w-5 h-5 text-gray-400"
															aria-hidden="true"
														/>
													</div>
													<Input
														type="text"
														disabled={isSubmitting}
														id={field.name}
														placeholder="Your last name"
														autoComplete="family-name"
														className="account-form-input block w-full rounded-md border-0 py-1.5 pl-10"
														{...field}
													/>
												</div>
											</FormControl>
											<FormMessage className="text-red-400" />
										</FormItem>
									)}
								/>
							</div>

							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											htmlFor={field.name}
											className="text-base-semibold text-dark-2 dark:text-light-2"
										>
											Email Address
										</FormLabel>
										<FormControl>
											<div className="relative rounded-md shadow-sm">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													<AtSignIcon
														className="w-5 h-5 text-gray-400"
														aria-hidden="true"
													/>
												</div>
												<Input
													type="text"
													disabled={isSubmitting}
													id={field.name}
													autoComplete="email"
													placeholder="Your email"
													className="account-form-input block w-full rounded-md border-0 py-1.5 pl-10"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							{/* Password */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel
											htmlFor={field.name}
											className="text-base-semibold text-dark-2 dark:text-light-2"
										>
											Password
										</FormLabel>
										<FormControl>
											<div className="relative rounded-md shadow-sm">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													<KeyIcon
														className="w-5 h-5 text-gray-400"
														aria-hidden="true"
													/>
												</div>
												<Input
													type="password"
													autoComplete="new-password"
													disabled={isSubmitting}
													id={field.name}
													placeholder="Your password"
													className="account-form-input block w-full rounded-md border-0 py-1.5 pl-10"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage className="text-red-400" />
									</FormItem>
								)}
							/>

							<div>
								<button
									type="submit"
									disabled={isSubmitting}
									className="form-button"
								>
									{isSubmitting ? (
										<Loader size={24} className="leading-[0] text-white" />
									) : (
										'Sign Up'
									)}
								</button>
							</div>

							<div className='mt-6'>
								<div className='relative'>
									<div className='absolute inset-0 flex items-center'>
										<div className='w-full border-t border-gray-300' />
									</div>
									<div className='relative flex justify-center text-sm'>
										<span className='px-2 text-dark-2 dark:text-light-2 bg-light-2/25 dark:bg-dark-2'>
                      Or, sign up with
										</span>
									</div>
								</div>

								<div className='mt-6'>
									<AuthSocialButton
										loading={googleLoading}
										text='Sign up with Google'
										icon={
											<>
												<svg className='w-5 h-5' viewBox='0 0 48 48'>
													<path
														fill='#FFC107'
														d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
													></path>
													<path
														fill='#FF3D00'
														d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
													></path>
													<path
														fill='#4CAF50'
														d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
													></path>
													<path
														fill='#1976D2'
														d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
													></path>
												</svg>
											</>
										}
										onClick={() => socialAction('google')}
									/>
								</div>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
