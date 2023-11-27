import Deets from '#/components/shared/Deets';
import Footer from '#/components/shared/Footer';
import Header from '#/components/shared/Header';
import Images from '#/components/shared/Images';
import Reviews from '#/components/shared/Reviews';
import Schedule from '#/components/shared/Schedule';

const Home = () => {
  return ( 
    <div className='min-h-full flex flex-col'>
      <div className='flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10'>
        <Header />
        <Images />
        <Schedule />
        <Deets />
        <Reviews />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
