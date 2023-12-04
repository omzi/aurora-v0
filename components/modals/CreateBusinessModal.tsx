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
import Image from 'next/image';
import Loader from 'react-ts-loaders';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Business } from '#/common.types';
import { isBase64Image } from '#/lib/utils';
import { Input } from '#/components/ui/input';
import { useEdgeStore } from '#/lib/edgestore';
import { Button } from '#/components/ui/button';
import { BusinessSchema } from '#/lib/validations';
import { Textarea } from '#/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ScrollArea } from '#/components/ui/scroll-area';
import { ChangeEvent, useEffect, useState } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { useBusinessModal } from '#/hooks/useBusinessModal';
import { AtSignIcon, BookCheckIcon, ImageIcon, MapPinIcon, PencilIcon, PhoneIcon, StoreIcon } from 'lucide-react';

const CreateBusinessModal = () => {
  const queryClient = useQueryClient();
  const { edgestore } = useEdgeStore();
	const businessModal = useBusinessModal();
	const [files, setFiles] = useState<File[]>([]);
  const { selectBusiness, selectedBusiness } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
	const onClose = useBusinessModal(state => state.onClose);
  
	const form = useForm<z.infer<typeof BusinessSchema>>({
    resolver: zodResolver(BusinessSchema),
		defaultValues: {
      name: '',
      description: '',
      email: '',
      phoneNumber: '',
      logo: '',
      registrationNumber: '',
      address: ''
    }
  });

  useEffect(() => {
    if (businessModal.isEditMode) {
      form.setValue('name', selectedBusiness?.name as string);
      form.setValue('email', selectedBusiness?.email as string);
      form.setValue('address', selectedBusiness?.address as string);
      form.setValue('registrationNumber', selectedBusiness?.registrationNumber as string);
      form.setValue('phoneNumber', selectedBusiness?.phoneNumber as string);
      form.setValue('description', selectedBusiness?.description as string);
      form.setValue('logo', selectedBusiness?.logo);
    } else form.reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[businessModal.isOpen , businessModal.isEditMode])

	const onSubmit = async (data: z.infer<typeof BusinessSchema>) => {
    try {
      setIsSubmitting(true);
      const blob = data.logo;
      const [file] = files;
      const hasImageChanged = blob && isBase64Image(blob);
      if (hasImageChanged) {
        const { url } = await edgestore.publicFiles.upload({ file });
        data.logo = url;
      }
      const editPayload = {
        id : selectedBusiness?.id,
        ...data
      }

      const response = businessModal.isEditMode
        ? await axios.put<{ data: Business }>('/api/businesses', editPayload)
        : await axios.post<{ data: Business }>('/api/businesses', data);

      queryClient.invalidateQueries({ queryKey: ['userBusinesses'] });
      const { data: business } = response.data;
      selectBusiness(business);
      toast.success( businessModal.isEditMode? 'Business info updated!' : 'Business created successfully!', { icon: '🎉' });
      form.reset();
      onClose();
      !businessModal.isEditMode && window.location.assign('/dashboard');

      return;
    } catch (error) {
      console.log('Create Business Error :>>', error);
      toast.error('An error occurred while creating your business');
    } finally {
      setIsSubmitting(false);
    }
  }

	const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataURL = event.target?.result?.toString() || '';

        fieldChange(imageDataURL);
      }

      fileReader.readAsDataURL(file);
    }
  };

	return (
    <Dialog open={businessModal.isOpen} onOpenChange={businessModal.onClose}>
      <DialogContent className='overflow-hidden'>
        <DialogHeader className='border-b pb-2'>
          <h2 className='text-lg font-normal text-dark-1 dark:text-light-2'>
            {businessModal.isEditMode
              ? 'Edit Business Info'
              : 'Create A Business'}
          </h2>
        </DialogHeader>
        <ScrollArea className='h-full max-h-[75vh]'>
          <div className='flex items-center px-2 mb-4 justify-between'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col justify-start gap-4 w-full'
              >
                {/* Business Logo */}
                <FormField
                  control={form.control}
                  name='logo'
                  render={({ field }) => (
                    <>
                      <FormItem className='flex gap-4 flex-col items-start sm:flex-row sm:items-center'>
                        <FormLabel className='account-form-image-label'>
                          {field.value ? (
                            <Image
                              src={field.value}
                              alt='Business Logo'
                              width={60}
                              height={60}
                              priority
                              className='w-[60px] h-[60px] rounded-full object-cover'
                            />
                          ) : (
                            <ImageIcon
                              width={48}
                              height={48}
                              className='p-2 rounded-full'
                            />
                          )}
                        </FormLabel>
                        <FormControl className='cursor-pointer'>
                          <label htmlFor='image'>
                            <span className='rounded-md bg-white px-2.5 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
                              {businessModal.isEditMode
                                ? 'Change Business Logo'
                                : 'Upload Business Logo'}
                            </span>
                            <Input
                              type='file'
                              disabled={isSubmitting}
                              id='image'
                              accept='image/*'
                              className='sr-only'
                              onChange={(e) =>
                                handleImageUpload(e, field.onChange)
                              }
                            />
                          </label>
                        </FormControl>
                      </FormItem>
                      <FormMessage className='text-red-400' />
                    </>
                  )}
                />

                {/* Business Name */}
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className='text-base-semibold text-dark-1 dark:text-light-2'
                      >
                        Business Name
                      </FormLabel>
                      <FormControl>
                        <div className='relative rounded-md shadow-sm'>
                          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <StoreIcon
                              className='w-5 h-5 text-gray-400'
                              aria-hidden='true'
                            />
                          </div>
                          <Input
                            type='text'
                            disabled={isSubmitting}
                            id={field.name}
                            placeholder='Your business name'
                            className='account-form-input block w-full rounded-md border-0 py-1.5 pl-10'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />

                {/* Business Address */}
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className='text-base-semibold text-dark-1 dark:text-light-2'
                      >
                        Business Address
                      </FormLabel>
                      <FormControl>
                        <div className='relative rounded-md shadow-sm'>
                          <div className='absolute inset-y-0 top-0 left-0 pt-3 pl-3 pointer-events-none'>
                            <MapPinIcon
                              className='w-5 h-5 text-gray-400'
                              aria-hidden='true'
                            />
                          </div>
                          <Textarea
                            id={field.name}
                            disabled={isSubmitting}
                            rows={1}
                            placeholder='Enter your business address'
                            className='account-form-textarea custom-scrollbar block w-full rounded-md border-0 py-1.5 pl-10'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />

                {/* Registeration Number */}
                <FormField
                  control={form.control}
                  name='registrationNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className='text-base-semibold text-dark-1 dark:text-light-2'
                      >
                        Registeration number
                      </FormLabel>
                      <FormControl>
                        <div className='relative rounded-md shadow-sm'>
                          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <BookCheckIcon
                              className='w-5 h-5 text-gray-400'
                              aria-hidden='true'
                            />
                          </div>
                          <Input
                            type='text'
                            disabled={isSubmitting}
                            id={field.name}
                            placeholder='Your business registeration number'
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
                  {/* Business Email */}
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor={field.name} className='text-base-semibold text-dark-1 dark:text-light-2'>
                          Business Email
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
                              placeholder='Your business email'
                              className='account-form-input block w-full rounded-md border-0 py-1.5 pl-10'
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className='text-red-400' />
                      </FormItem>
                    )}
                  />

                  {/* Business Phone Number */}
                  <FormField
                    control={form.control}
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor={field.name}
                          className='text-base-semibold text-dark-1 dark:text-light-2'
                        >
                          Business Phone Number
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
                              placeholder='Your business mobile number'
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

                {/* Business Description */}
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className='text-base-semibold text-dark-1 dark:text-light-2'
                      >
                        Business Description
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
                            rows={1}
                            placeholder='Describe your business in 100 characters'
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
                  <Button variant='outline' type='button' disabled={isSubmitting} onClick={businessModal.onClose}>
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='relative bg-core hover:bg-blue-800 text-white'
                  >
                    {isSubmitting ? (
                      <span className='opacity-0'>
                        {businessModal.isEditMode
                          ? 'Save changes'
                          : 'Create business'}
                      </span>
                    ) : (
                      <span className='opacity-100'>
                        {businessModal.isEditMode
                          ? 'Save changes'
                          : 'Create business'}
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

export default CreateBusinessModal;
