import { m } from 'framer-motion';
import { useMousePosition } from '../../hooks/useMousePosition';

type Props = { isHovering: boolean };

const CustomCursor: React.FC<Props> = ({ isHovering }) => {
  const { x, y } = useMousePosition();

  return (
    <m.div
      className="fixed pointer-events-none w-6 h-6 bg-white rounded-full mix-blend-difference hidden md:block"
      // animate={{ x, y,}}
      // transition={{ type: 'spring', stiffness: 200 }}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)', 
      }}
    />
  );
};

export default CustomCursor;
