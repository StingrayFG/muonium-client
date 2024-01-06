import { Link } from 'react-router-dom';

export default function FileContextMenu ({ point, file }) {
  return (
    <div className='w-24 bg-neutral-400 border-solid border-2 border-white' style={{position: 'absolute', top: point.y, left: point.x}}>
      <p>Download</p>
      <p>Rename</p>
    </div>    
  );
};
