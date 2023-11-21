'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '#/components/ui/form';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import Loader from 'react-ts-loaders';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '#/components/ui/input';
import { UserSchema } from '#/lib/validations';
import { AtSignIcon, KeyIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthSocialButton from '#/components/AuthSocialButton';

const SignInSchema = UserSchema.pick({
  password: true,
  email: true
});

const SignIn = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      password: '',
      email: ''
    },
  });
  const { handleSubmit } = form;

  const socialAction = async (action: 'google' | 'github') => {
    setIsSubmitting(true);
    setGoogleLoading(true);
    setGithubLoading(true);

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
      setGithubLoading(false);
    }
  }

  const onSubmit = (data: any) => {
    console.log('Sign-In Data :>>', data);
    signInUser(data);
  };

  const signInUser = async (data: Required<z.infer<typeof SignInSchema>>) => {
    try {
      setIsSubmitting(true);
      setGoogleLoading(true);
      setGithubLoading(true);

      const callback = await signIn('credentials', { ...data, redirect: false });
      if (callback?.error) return toast.error('Invalid credentials!');

      if (callback?.ok) {
        form.reset();
        router.push('/dashboard');
      }

      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Sign-In Error :>>', error);
      toast.error(error.message ?? 'An error occurred while signing you in');
    } finally {
      setIsSubmitting(false);
      setGoogleLoading(false);
      setGithubLoading(false);
    }
  };
	
	return (
    <div className='flex flex-col justify-center w-full min-h-full p-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <Image
          className='mx-auto'
          src={'/images/logo.png'}
          height={48}
          width={48}
          alt='Aurora'
          fetchPriority='high'
        />
        <h2 className='mt-6 text-2xl font-bold text-center text-dark-1 dark:text-light-2'>
          Sign in to your Aurora account
        </h2>
        <p className='mt-2 text-sm text-center text-gray-600'>
          Or,{' '}
          <Link
            href={'/auth/sign-up'}
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            create your free account
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='px-4 py-8 shadow bg-light-2/25 dark:bg-dark-2 sm:rounded-lg sm:px-10'>
          <Form {...form}>
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className='text-base-semibold text-dark-2 dark:text-light-2'>
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className='relative rounded-md shadow-sm'>
                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                          <AtSignIcon
                            className='w-5 h-5 text-gray-400'
                            aria-hidden='true'
                          />
                        </div>
                        <Input
                          type='text'
                          disabled={isSubmitting}
                          id={field.name}
                          placeholder='Your email'
                          className='account-form-input block w-full rounded-md border-0 py-1.5 pl-10'
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
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className='text-base-semibold text-dark-2 dark:text-light-2'>
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className='relative rounded-md shadow-sm'>
                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                          <KeyIcon
                            className='w-5 h-5 text-gray-400'
                            aria-hidden='true'
                          />
                        </div>
                        <Input
                          type='password'
                          autoComplete='new-password'
                          disabled={isSubmitting}
                          id={field.name}
                          placeholder='Your password'
                          className='account-form-input block w-full rounded-md border-0 py-1.5 pl-10'
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* <div className='text-sm text-right'>
                <Link
                  href={'/auth/forgot-password'}
                  className="className='font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div> */}

              <div>
                <button type='submit' disabled={isSubmitting} className='form-button'>
                  {isSubmitting ? (
                    <Loader size={24} className='leading-[0] text-white' />
                  ) : 'Sign In'}
                </button>
              </div>

              <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-dark-2 dark:text-light-2 bg-light-2/25 dark:bg-dark-2">Or, sign in with</span>
                </div>
              </div>

              <div className="mt-6">
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

                {/* <AuthSocialButton
                  loading={githubLoading}
                  text='Sign up with GitHub'
                  icon={
                    <>
                      <svg className='w-5 h-5' fill='#000' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </>
                  }
                  onClick={() => socialAction('github')}
                /> */}
              </div>
            </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
