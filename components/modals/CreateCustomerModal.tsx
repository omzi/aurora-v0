'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader
} from '#/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '#/components/ui/form';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import Loader from 'react-ts-loaders';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Customer } from '#/common.types';
import { Input } from '#/components/ui/input';
import { Button } from '#/components/ui/button';
import { CustomerSchema } from '#/lib/validations';
import { Textarea } from '#/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCustomerModal } from '#/hooks/useCustomerModal';
import { AtSignIcon, PencilIcon, PhoneIcon, UserIcon } from 'lucide-react';
import { ScrollArea } from '#/components/ui/scroll-area';
import { useUserContext } from '../contexts/UserContext';
import { useQueryClient } from '@tanstack/react-query';

const CreateCustomerModal = () => {
  const queryClient = useQueryClient();
	const customerModal = useCustomerModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
	const onClose = useCustomerModal(state => state.onClose);
	
	const { selectedBusiness } = useUserContext();
  if (!selectedBusiness) return;
  
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const form = useForm<z.infer<typeof CustomerSchema>>({
    resolver: zodResolver(CustomerSchema),
		defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      address: ''
    }
  });

	const onSubmit = async (data: z.infer<typeof CustomerSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post<{ data: Customer }>(`/api/customers?businessId=${selectedBusiness.id}`, data);
			const { data: customer } = response.data;

      queryClient.invalidateQueries({ queryKey: ['userCustomers'] });
      toast.success('Customer created successfully!', { icon: '✨' });
      form.reset();
      onClose();

      return;
    } catch (error) {
      console.log('Create Customer Error :>>', error);
      toast.error('An error occurred while creating your customer');
    } finally {
      setIsSubmitting(false);
    }
  }

	return (
    <Dialog open={customerModal.isOpen} onOpenChange={customerModal.onClose}>
      <DialogContent className='overflow-hidden'>
        <DialogHeader className='border-b pb-2'>
          <h2 className='text-lg font-normal text-dark-1 dark:text-light-2'>
            Add A Customer
          </h2>
        </DialogHeader>
        <ScrollArea className='h-full max-h-[75vh]'>
          <div className='flex items-center px-2 mb-4 justify-between'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col justify-start gap-4 w-full'
              >
                {/* Customer Name */}
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className='text-base-semibold text-dark-1 dark:text-light-2'
                      >
                        Customer Name
                      </FormLabel>
                      <FormControl>
                        <div className='relative rounded-md shadow-sm'>
                          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <UserIcon
                              className='w-5 h-5 text-gray-400'
                              aria-hidden='true'
                            />
                          </div>
                          <Input
                            type='text'
                            disabled={isSubmitting}
                            id={field.name}
                            placeholder='Your customer&apos; name'
                            className='account-form-input block w-full rounded-md border-0 py-1.5 pl-10'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 w-full gap-4 items-start'>
                  {/* Customer Email */}
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={field.name}
                          className='text-base-semibold text-dark-1 dark:text-light-2'
                        >
                          Customer Email
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
                              placeholder='Your customer&apos;s email address'
                              className='account-form-input block w-full rounded-md border-0 py-1.5 pl-10'
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className='text-red-400' />
                      </FormItem>
                    )}
                  />

                  {/* Customer Phone Number */}
                  <FormField
                    control={form.control}
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={field.name}
                          className='text-base-semibold text-dark-1 dark:text-light-2'
                        >
                          Phone number
                        </FormLabel>
                        <FormControl>
                          <div className='relative rounded-md shadow-sm'>
                            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                              <PhoneIcon
                                className='w-5 h-5 text-gray-400'
                                aria-hidden='true'
                              />
                            </div>
                            <Input
                              type='text'
                              disabled={isSubmitting}
                              id={field.name}
                              placeholder='Your customer&apos;s phone number'
                              className='account-form-input block w-full rounded-md border-0 py-1.5 pl-10'
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className='text-red-400' />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Customer Address */}
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className='text-base-semibold text-dark-1 dark:text-light-2'
                      >
                        Customer Address
                      </FormLabel>
                      <FormControl>
                        <div className='relative rounded-md shadow-sm'>
                          <div className='absolute inset-y-0 top-0 left-0 pt-3 pl-3 pointer-events-none'>
                            <PencilIcon
                              className='w-5 h-5 text-gray-400'
                              aria-hidden='true'
                            />
                          </div>
                          <Textarea
                            id={field.name}
                            disabled={isSubmitting}
                            rows={2}
                            placeholder='Enter your customer&apos; address'
                            className='account-form-textarea custom-scrollbar block w-full rounded-md border-0 py-1.5 pl-10'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />

                <div className='space-x-2 flex items-center justify-end'>
                  <Button
                    variant='outline'
                    type='button'
                    disabled={isSubmitting}
                    onClick={customerModal.onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='relative bg-core hover:bg-blue-800 text-white'
                  >
                    {isSubmitting ? (
                      <span className='opacity-0'>
                        {customerModal.isEditMode
                          ? 'Save changes'
                          : 'Create customer'}
                      </span>
                    ) : (
                      <span className='opacity-100'>
                        {customerModal.isEditMode
                          ? 'Save changes'
                          : 'Create customer'}
                      </span>
                    )}
                    {isSubmitting && (
                      <div className='absolute flex items-center justify-center w-full h-full'>
                        <Loader
                          type='spinner'
                          size={28}
                          className='text-black dark:text-white leading-[0]'
                        />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCustomerModal;
