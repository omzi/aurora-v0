import Image, { StaticImageData } from 'next/image';

import avatarImage1 from '#/public/images/avatars/avatar-1.png';
import avatarImage2 from '#/public/images/avatars/avatar-2.png';
import avatarImage3 from '#/public/images/avatars/avatar-3.png';
import avatarImage4 from '#/public/images/avatars/avatar-4.png';
import avatarImage5 from '#/public/images/avatars/avatar-5.png';
import avatarImage6 from '#/public/images/avatars/avatar-6.png';

const testimonials = [
  [
    {
      content:
        "Aurora is incredibly user-friendly; it's like having a personal assistant for my business. I'm amazed at its efficiency.",
      author: {
        name: 'Chike Onyemere',
        role: 'CEO, Zenith Crafts',
        image: avatarImage1
      },
    },
    {
      content:
        'I reached out to Aurora support, and they responded promptly, resolving my issue in no time. Their support is unmatched!',
      author: {
        name: 'Adewale Ajayi',
        role: 'Director, Emerald Ventures',
        image: avatarImage4
      },
    },
  ],
  [
    {
      content:
        "Aurora has transformed my business operations. Every payday is a joy, and I've seen a positive impact on my bottom line.",
      author: {
        name: 'Nneka Afolayan',
        role: 'Founder, Pearl Investments',
        image: avatarImage5
      },
    },
    {
      content:
        "Tasks that used to be a headache are now a breeze with Aurora. It truly simplifies my workflow, and I couldn't be happier.",
      author: {
        name: 'Mark Essien',
        role: 'MD, Hotels.ng',
        image: avatarImage2
      },
    },
  ],
  [
    {
      content:
        'Thanks to Aurora, handling tax remittance is seamless. It has eliminated the stress, allowing me to focus on growing my business.',
      author: {
        name: 'Kate Bisung',
        role: 'Founder, West Africa Innovations',
        image: avatarImage3
      },
    },
    {
      content:
        "Aurora's support team is incredibly responsive. They've been instrumental in ensuring smooth operations for my business.",
      author: {
        name: 'Hauwa Shaibu',
        role: "CEO, Hauwa's Handmades",
        image: avatarImage6
      },
    },
  ],
];

type Author = {
  name: string;
  role: string;
  image: StaticImageData;
};

type Testimonial = {
  content: string;
  author: Author;
};

type TestimonialsProps = {};

const QuoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg aria-hidden='true' width={105} height={78} {...props}>
      <path d='M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z' />
    </svg>
  );
};

const Testimonials: React.FC<TestimonialsProps> = () => {
  return (
    <section
      id='testimonials'
      aria-label='What our customers are saying'
      className='bg-slate-50 dark:bg-[#1f1f1f] w-[100vw] py-16 sm:py-28'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h4 className='font-clash-display-bold mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold'>
            Loved By Thousands Of Businesses
          </h4>
          <p className='text-xl mt-5'>
            Experience the irresistible simplicity of our software that captures
            hearts effortlessly. At Aurora, we redefine simplicity by focusing
            on what truly matters, without skipping the mission-critical
            features.
          </p>
        </div>
        <ul
          role='list'
          className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3'
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role='list' className='flex flex-col gap-y-6 sm:gap-y-8'>
                {column.map((testimonial, testimonialIndex) => (
                  <li key={testimonialIndex}>
                    <figure className='relative text-left rounded-2xl bg-white dark:bg-black p-6 shadow-xl shadow-slate-900/10'>
                      <QuoteIcon className='absolute left-6 top-6 fill-black/10 dark:fill-white/10' />
                      <blockquote className='relative'>
                        <p className='text-lg font-thin tracking-tight text-slate-900 dark:text-slate-100'>
                          {testimonial.content}
                        </p>
                      </blockquote>
                      <figcaption className='relative mt-6 flex items-center justify-between border-t border-slate-900 dark:border-slate-100 pt-6'>
                        <div>
                          <div className='font-display text-base text-slate-900 dark:text-slate-100'>
                            {testimonial.author.name}
                          </div>
                          <div className='mt-1 text-sm text-slate-700 dark:text-slate-300'>
                            {testimonial.author.role}
                          </div>
                        </div>
                        <div className='overflow-hidden rounded-full bg-slate-50 dark:bg-slate-950'>
                          <Image
                            className='h-14 w-14 object-cover'
                            src={testimonial.author.image}
                            alt=''
                            width={56}
                            height={56}
                          />
                        </div>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials;
