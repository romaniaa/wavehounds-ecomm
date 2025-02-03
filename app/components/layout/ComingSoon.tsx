import { useEffect, useState } from 'react';
import { SanityImage } from '../sanity/SanityImage';
import { useMousePosition } from '../../hooks/useMousePosition';
import { m } from 'framer-motion';
import CustomCursor from '../../components/ui/CustomCursor';
import { useRootLoaderData } from '~/root';

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
    }, 500); // Change image every 0.5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [settings?.cSimages?.length]);

  return (
    <div className="relative h-screen bg-[#b8a336] text-black flex flex-col items-center justify-center">
      <svg className="z-0 w-[300px]" version="1.1" x="0px" y="0px" viewBox="0 0 216 216" xml:space="preserve">
        <path d="M195.9,130.5c-4.1,7.3-11.5,12.6-20.8,15.2c-3.6,1-7.1,1.4-10.5,1.4c-4.4,0-8.5-0.8-12.4-2.3
          c-8.2-3.3-14.5-10-16.9-18.1c-1.1-3.7,0.9-7.7,4.6-8.9c3.6-1.1,7.5,1,8.6,4.7c1.1,3.9,4.5,7.3,8.7,9c4.1,1.7,9.3,1.8,14.5,0.4
          c5.7-1.5,10.2-4.7,12.4-8.6c2.2-3.8,2.8-9.2,1.8-16.1c-1.7-12.1-6.9-22.8-14.6-30.1C163,69.5,151.9,66,142,67.9
          c-5.5,1.1-11.2,3.9-18.4,9c-7.8,5.6-15,11.9-22.6,18.6c-4.3,3.8-8.7,7.8-13.3,11.5c-6.3,5.2-14.8,11.7-24.8,16.7
          c0.5,2.9,0.1,5.7-1.2,8.2c-1.7,3.3-5.5,7.3-14.3,7.6c-0.5,0-0.9,0-1.4,0c-2.3,0-4.6-0.2-6.9-0.5c-0.1,2.6,0.2,4.8,1.4,6.3
          c1.9,2.3,6.2,3,10.5,3.5c15.8,2,33.9,3.6,47.4-4.6c3.7-2.3,6.5-4.9,8.1-7.8c1.6-2.9,2-6.2,1.1-8.7c-1.2-3.4,0.3-7.2,3.4-8.8
          c3.2-1.6,7-0.5,8.9,2.6c3.4,5.5,5.1,10.8,6.9,16c0.7,2,1.4,4.1,2.2,6.2c1.4,3.6-0.4,7.8-3.9,9.2c-3.5,1.4-7.5-0.4-8.9-4
          c-0.2-0.4-0.3-0.9-0.5-1.3c-2.7,3.3-6.1,6.3-10.3,8.8c-10.4,6.3-22.1,8.2-33.7,8.2c-7.6,0-15.2-0.8-22.4-1.7
          c-5.1-0.7-13.6-1.8-19.1-8.3c-5-5.9-5.4-13.4-4.5-19.7c-2.4-1.4-4.3-3-5.9-5.1c-4.7-6.2-5.1-16.5,1-20.1c14.5-8.5,29.5-2.2,34.6,1.9
          c9.4-4.5,17.6-10.8,23.7-15.8c4.4-3.6,8.7-7.5,12.9-11.2c7.5-6.7,15.3-13.6,23.8-19.6c6-4.2,14-9.3,23.6-11.2
          c14-2.8,29.8,2,41.1,12.7c10.1,9.5,16.8,23.2,19,38.6C200.8,115.4,199.6,123.9,195.9,130.5z M66.8,92.5c5.9,0,10.7-2.3,10.7-7.5
          c0-5.2-2.7-7.9-10.7-8.8c-8-1-10.7,3.9-10.7,8.8C56.2,89.9,60.9,92.5,66.8,92.5z M150.1,91.6c0-4.7-2.3-9.4-9.7-8.6
          c-7.3,1.3-9.7,5-9.7,8.6c0,4.7,2.9,8.6,9.7,8.6C147,100.2,150.1,96.3,150.1,91.6z"/>
      </svg>
      <h1 className="text-8xl font-bold mb-4">{settings?.cStitle}</h1>
      <p className="text-lg text-black max-w-2xl text-center">{settings?.cScontent}</p>
      <div
        className="absolute h-full w-full max-w-[550px] max-h-[550px] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-opacity duration-75"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        >
        {hovering && settings?.cSimages?.map((image, index) => (
          <m.div
            key={image._key}
            className="bg-[#b8a336]"
            style={{
              left: x,  // Offset to center the image
              top: y,   // Offset to center the image
            }}
            animate={{
              opacity: index === imageIndex ? 1 : 0,
            }}
            // transition={{ type: 'spring', stiffness: 300 }}
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
