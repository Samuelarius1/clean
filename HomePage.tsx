import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Events from '../components/sections/Events';
import WhyChoose from '../components/sections/WhyChoose';
import Testimonials from '../components/sections/Testimonials';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Services />
      <Events />
      <WhyChoose />
      <Testimonials />
    </>
  );
};

export default HomePage;