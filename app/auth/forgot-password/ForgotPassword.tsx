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
import { useState } from 'react';
import Loader from 'react-ts-loaders';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '#/components/ui/input';
import { UserSchema } from '#/lib/validations';
import { AtSignIcon, KeyIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthSocialButton from '#/components/AuthSocialButton';

const ForgotPasswordSchema = UserSchema.pick({
  email: true
});

const SignIn = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: ''
    },
  });
  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.log('Sign-In Data :>>', data);
    signInUser(data);
  };

  const signInUser = async (data: Required<z.infer<typeof ForgotPasswordSchema>>) => {
    try {
      setIsSubmitting(true);

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
          Forgot your password?
        </h2>
        <p className='mt-2 text-sm text-center text-gray-600'>
          Or,{' '}
          <Link
            href={'/auth/sign-in'}
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            sign in to your Aurora account
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='px-4 py-8 shadow bg-light-2/25 dark:bg-dark-2 sm:rounded-lg sm:px-10'>
          <Form {...form}>
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <p className='text-sm text-center font-medium text-gray-800 dark:text-gray-400'>
                Oops! Can&apos;t remember your password? No worries, we&apos;ve
                got your back. Enter your email below, and we&apos;ll send you a
                magical link to reset your password.
              </p>
              {/* Email */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor={field.name}
                      className='text-base-semibold text-dark-2 dark:text-light-2'
                    >
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
                    <FormMessage className='text-red-400' />
                  </FormItem>
                )}
              />

              <div>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='form-button'
                >
                  {isSubmitting ? (
                    <Loader size={24} className='leading-[0] text-white' />
                  ) : (
                    'Request Email Link'
                  )}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
