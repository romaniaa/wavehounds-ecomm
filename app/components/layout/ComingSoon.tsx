import { useEffect, useState } from 'react';
import { SanityImage } from '../sanity/SanityImage';
import { useMousePosition } from '../../hooks/useMousePosition';
import { m } from 'framer-motion';
import CustomCursor from '../../components/ui/CustomCursor';
import { useRootLoaderData } from '~/root';

import WhLogo from '../icons/WhLogo';

const ComingSoon: React.FC = () => {
  const { x, y } = useMousePosition();
  const [hovering, setHovering] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const { sanityRoot } = useRootLoaderData();
  const data = sanityRoot?.data;
  const settings = data?.settings;

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % settings?.cSimages?.length);
    }, 500);

    return () => clearInterval(interval);
  }, [settings?.cSimages?.length]);

  return (
    <div className="relative h-screen bg-[#b8a336] text-black flex flex-col items-center justify-center p-4">
      <WhLogo/>
      <h1 className="text-8xl font-bold mb-4 text-center md:text-left">{settings?.cStitle}</h1>
      <p className="text-lg text-black max-w-2xl text-center">{settings?.cScontent}</p>
      <div
        className="absolute h-auto w-full max-w-[550px] max-h-[550px] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-opacity duration-75"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        >
        {hovering && settings?.cSimages?.map((image, index) => (
          <m.div
            key={image._key}
            className="bg-[#b8a336]"
            style={{
              left: x,
              top: y, 
            }}
            animate={{
              opacity: index === imageIndex ? 1 : 0,
            }}
          >
            <SanityImage data={image} className=" w-full h-full absolute" sizes='900px' />
          </m.div>
        ))}
         
      </div>
      <CustomCursor isHovering={hovering} />
    </div>
  );
};

export default ComingSoon;
