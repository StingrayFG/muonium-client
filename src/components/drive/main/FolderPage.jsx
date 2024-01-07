import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import FileService from 'services/FileService.jsx';
import FileElement from 'components/drive/main/element/FileElement.jsx';
import FileContextMenu from 'components/drive/main/menu/FileContextMenu.jsx';

export default function FolderPage ({ address }) {
  const userData = useSelector(state => state.user);

  const [file, setFile] = useState();
  const [requiresUpload, setRequiresUpload] = useState();
  const [requiresUpdate, setRequiresUpdate] = useState(true);

  const [children, setChildren] = useState();

  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
    handleChange(acceptedFiles[0])
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop, multiple: false, noDragEventsBubbling: true, noClick: true
  });

  const handleChange = (file) => {
    console.log(file)
    setFile(file);
    if (file && (file.size < (1024 * 1024 * 100))) {
      setRequiresUpload(true);
    }
  };

  useEffect(() => {
    if (requiresUpload) {
      FileService.handleFileUpload(userData, file);
      setRequiresUpload(false);
    }
  });

  useEffect(() => {
    if (requiresUpdate) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };

      const body = { ownerUuid: userData.userUuid, driveUuid: userData.driveUuid, parentUuid: address };
      
      axios.post(process.env.REACT_APP_BACKEND_URL + '/folder/get', body, {headers})
        .then(res => {
          setChildren(res.data);
          console.log(res.data);
        })
        .catch(err => {
          console.error(err);
        });

      setRequiresUpdate(false);
    }
  });



  const [clicked, setClicked] = useState(false);
  const [clickedElement, setClickedElement] = useState();
  const [point, setPoint] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleClick = () => setClicked(false);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleContextMenuClick = (event, file) => {
    event.preventDefault();
    console.log(file);
    setClickedElement(file);
    setClicked(true);
    setPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  return (
    <div className='w-full h-full px-4 py-4
      bg-neutral-600' {...getRootProps()}>
      <input {...getInputProps()} />
      <div className='grid grid-cols-6 grid-rows-2 
      border-solid border-2 border-black'>
        {children &&
        <>
          {children.files.map((file) => (
            <FileElement key={file.uuid} file={file} handleContextMenuClick={handleContextMenuClick}/>
          ))}
        </>
        }

        {clicked && (
          <FileContextMenu point={point} file={clickedElement}/>
        )}
      </div>


    </div>
  );
}