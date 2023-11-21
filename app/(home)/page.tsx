import Footer from '#/components/shared/Footer';
import Header from '#/components/shared/Header';
import Images from '#/components/shared/Images';

const Home = () => {
  return ( 
    <div className='min-h-full flex flex-col'>
      <div className='flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10'>
        <Header />
        <Images />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
