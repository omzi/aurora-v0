import Image from 'next/image';

const stats = [
  { id: 1, name: 'Businesses on the platform', value: '8,000+' },
  { id: 2, name: 'Flat platform fee', value: '3%' },
  { id: 3, name: 'Uptime guarantee', value: '99.9%' },
  { id: 4, name: 'Paid out to businesses', value: '₦800M' }
];

const Stats = () => {
  return (
    <div className='relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32'>
      <Image
        src='/images/business.jpg'
        fill
        alt='Business'
        className='absolute inset-0 -z-10 h-full w-full object-cover mix-blend-multiply'
      />
      <div className='relative w-[100vw] px-6 lg:px-8'>
        <div
          className='absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10'
          aria-hidden='true'
        >
          <div
            className='aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className='mx-auto max-w-4xl lg:mx-0 text-left'>
          <h2 className='text-xs font-medium uppercase px-2 rounded-2xl inline-block leading-6 bg-indigo-600 text-white'>
            Our track record
          </h2>
					<h4 className='font-clash-display-bold text-white mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold'>
            Trusted By Businesses Worldwide
          </h4>
          <p className='mt-6 text-xl leading-8 text-gray-300'>
            Running a successful business demands more than just effort; it
            requires a reliable partner. Join the ranks of thriving
            entrepreneurs who trust Aurora for seamless payment management and
            unparalleled support.
          </p>
        </div>
        <dl className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4'>
          {stats.map(stat => (
            <div
              key={stat.id}
              className='flex flex-col gap-y-3 border-l border-white/10 pl-6'
            >
              <dt className='text-base leading-6'>{stat.name}</dt>
              <dd className='order-first text-3xl font-semibold'>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default Stats;
