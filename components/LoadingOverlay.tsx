import Loader from 'react-ts-loaders';

const LoadingOverlay: React.FC = () => {
  return (
    <div className='absolute inset-0 z-50 -m-10 flex items-center justify-center bg-[rgba(215,215,215,0.5)] dark:bg-[rgba(40,40,40,0.5)]'>
      <Loader size={50} type='spinner' className='text-white dark:text-black' />
    </div>
  );
};

export default LoadingOverlay;
