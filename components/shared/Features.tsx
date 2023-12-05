import {
  RocketIcon,
  UserIcon,
  LineChartIcon,
  GlobeIcon,
  PaletteIcon,
  CreditCardIcon,
} from 'lucide-react';

const features = [
  {
    name: 'Streamlined Invoicing',
    description:
      'Aurora takes the hassle out of invoicing. Create polished, professional invoices effortlessly and stay on top of payment transactions with our intuitive platform.',
    icon: RocketIcon,
  },
  {
    name: 'Customer Management',
    description:
      "Build lasting connections with your customers using Aurora's robust customer management tools. Effortlessly maintain, update, and access customer profiles with just a few clicks.",
    icon: UserIcon,
  },
  {
    name: 'Real-time Analytics',
    description:
      "Gain valuable insights into your business performance with Aurora's real-time analytics. Track revenue, monitor outstanding payments, and make informed decisions to drive success.",
    icon: LineChartIcon,
  },
  {
    name: 'Multi-Business Support',
    description:
      'Aurora empowers you to manage multiple businesses effortlessly. Switch between businesses seamlessly within the platform, ensuring efficiency and flexibility.',
    icon: GlobeIcon,
  },
  {
    name: 'Business Customization',
    description:
      'Personalize your business profiles with logos and detailed descriptions. Aurora allows you to effortlessly edit and update business information, ensuring a unique and professional identity.',
    icon: PaletteIcon,
  },
  {
    name: 'Hassle-free Withdrawals',
    description:
      "Take control of your finances with Aurora's easy withdrawal process. Initiate and track withdrawal requests effortlessly, ensuring seamless payouts directly to your linked bank account.",
    icon: CreditCardIcon
  },
];

const Features = () => {
  return (
    <div className='w-[100vw] py-24'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl lg:text-center'>
          <h2 className='text-xs font-medium uppercase px-2 rounded-2xl inline-block leading-6 bg-indigo-600 text-white'>
            Scale faster
          </h2>
          <h4 className='font-clash-display-bold text-black dark:text-white mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold'>
            Elevate Your Business with Aurora&apos;s Powerful Features
          </h4>
          <p className='mt-6 text-xl leading-8 text-gray-600'>
            Discover how Aurora transforms small business management with a
            suite of cutting-edge features designed to simplify your workflow
            and boost efficiency.
          </p>
        </div>
        <div className='mx-auto mt-16 max-w-2xl lg:max-w-4xl'>
          <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16'>
            {features.map(feature => (
              <div key={feature.name} className='relative pl-16 text-left'>
                <dt className='text-base font-semibold leading-7 text-gray-900 dark:text-gray-100'>
                  <div className='absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600'>
                    <feature.icon
                      className='h-8 w-8 text-white'
                      aria-hidden='true'
                    />
                  </div>
                  <span className='text-xl font-medium'>{feature.name}</span>
                </dt>
                <dd className='mt-2 text-lg leading-7 text-gray-600'>
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default Features;
