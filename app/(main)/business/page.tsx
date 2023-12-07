'use client';

import { useUserContext } from '#/components/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar';
import { Button } from '#/components/ui/button';
import { Skeleton } from '#/components/ui/skeleton';
import { useBusinessModal } from '#/hooks/useBusinessModal';
import { ImageIcon, PenIcon, PlusIcon } from 'lucide-react';

const BusinessInfo = () => {
  const businessModal = useBusinessModal();
  const { selectedBusiness } = useUserContext();
  if (!selectedBusiness) return;

  return (
    <div className="bg-transparent flex w-[calc(100%-50px)] container my-6 sm:my-10 flex-col px-4 py-5 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Business Information</h1>
        <Button
          onClick={businessModal.onOpen}
          className="bg-core hover:bg-blue-800 text-white"
          variant="default"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Business
        </Button>
      </div>

      <div className="p-4 md:p-[3rem] pt-[1.5rem] lg:pt-[3rem] mt-[1rem] border-t-[1px] w-full flex">
        <div className="flex flex-col lg:flex-row items-center w-full gap-[1.5rem] lg:gap-[5rem]">
          {selectedBusiness?.logo ? (
            <Avatar className="w-[6rem] h-[6rem] rounded-[50%]">
              <AvatarImage
                src={selectedBusiness!.logo}
                alt={selectedBusiness!.name}
              />
              <AvatarFallback>
                <Skeleton className="h-[6rem] w-[6rem] rounded" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="inline-block rounded-[50%] justify-center items-center p-9 text-[3rem] bg-gray-300">
              <ImageIcon />
            </div>
          )}
          <div className="w-full lg:w-[80%]">
            <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 md:gap-y-8 gap-x-8 justify-between">
              <div className="flex flex-col gap-[0.4rem]">
                <div className="text-[0.95rem] sm:text-[1.1rem] text-gray-400 ">
                  Business Name
                </div>
                <h1 className="text-[1.05rem] sm:text-[1.2rem]">
                  {selectedBusiness?.name}
                </h1>
              </div>
              <div className="flex flex-col gap-[0.4rem]">
                <div className="text-[0.95rem] sm:text-[1.1rem] text-gray-400">
                  Business Email
                </div>
                <h1 className="text-[1.05rem] sm:text-[1.2rem] break-words">
                  {selectedBusiness?.email || 'Not Available'}
                </h1>
              </div>
              <div className="flex flex-col gap-[0.4rem]">
                <div className="text-[0.95rem] sm:text-[1.1rem] text-gray-400">
                  Business Address
                </div>
                <h1 className="text-[1.05rem] sm:text-[1.2rem]">
                  {selectedBusiness?.address || 'Not Available'}
                </h1>
              </div>
              <div className="flex flex-col gap-[0.4rem]">
                <div className="text-[0.95rem] sm:text-[1.1rem] text-gray-400">
                  Business Description
                </div>
                <h1 className="text-[1.05rem] sm:text-[1.2rem]">
                  {selectedBusiness?.description || 'Not Available'}
                </h1>
              </div>
              <div className="flex flex-col gap-[0.4rem]">
                <div className="text-[0.95rem] sm:text-[1.1rem] text-gray-400">
                  Business Phone Number
                </div>
                <h1 className="text-[1.05rem] sm:text-[1.2rem]">
                  {selectedBusiness?.phoneNumber || 'Not Available'}
                </h1>
              </div>
              <div className="flex flex-col gap-[0.4rem]">
                <div className="text-[0.95rem] sm:text-[1.1rem] text-gray-400">
                  Registeration Number
                </div>
                <h1 className="text-[1.05rem] sm:text-[1.2rem]">
                  {selectedBusiness?.registrationNumber || 'Not Available'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        onClick={businessModal.toggleEditOpen}
        className="self-start mx-auto bg-core hover:bg-blue-800 text-white"
      >
        <PenIcon className="h-4 w-4 mr-2" />
        Edit Business Informatiion
      </Button>
    </div>
  );
};

export default BusinessInfo;
