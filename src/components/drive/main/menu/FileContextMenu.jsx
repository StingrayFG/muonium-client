import { useSelector } from 'react-redux';

import FileService from 'services/FileService.jsx';

export default function FileContextMenu ({ point, file }) {
  const userData = useSelector(state => state.user);

  return (
    <div className='w-24 bg-neutral-400 border-solid border-2 border-white' style={{position: 'absolute', top: point.y, left: point.x}}>
      <button onClick={(event) => {FileService.handleFileDownload(userData, file)}}>Download</button>
      <p>Rename</p>
    </div>    
  );
};
