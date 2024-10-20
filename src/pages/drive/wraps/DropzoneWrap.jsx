import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/material';

import { env } from 'env.js'

import { uploadElement } from 'state/slices/currentFolderSlice';

import { DropzoneContext } from 'contexts/DropzoneContext';


export default function DropzoneWrap ({ children }) {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);
  const currentFolderData = useSelector(state => state.currentFolder);

  // Dropzone
  const [file, setFile] = useState();
  const [requiresUpload, setRequiresUpload] = useState();

  const onDrop = useCallback(acceptedFiles => {
    //console.log(acceptedFiles);
    handleChange(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop, multiple: false, noDragEventsBubbling: true, noClick: true, noKeyboard: true,
  });

  const handleChange = (file) => {
    setFile(file);
    if (file && (file.size < (1024 * 1024 * env.REACT_APP_MAX_FILE_SIZE))) {
      setRequiresUpload(true);
    }
  };

  useEffect(() => {
    if (requiresUpload) {
      let newFile = { 
        uuid: 'temp-' + Date.now(), 
        name: file.name, 
        type: 'file', 
        parentUuid: currentFolderData.uuid
      };   

      if (['png', 'webp', 'jpg', 'jpeg'].includes(file.name.split('.').pop())) {
        newFile.imageBlob = URL.createObjectURL(file);
      }

      dispatch(uploadElement({ userData, driveData, element: newFile, file }));
      setRequiresUpload(false);
    }
  }, [requiresUpload]);

  return (
    <DropzoneContext.Provider value={{ open }}>
      <Box {...getRootProps()} className='w-full h-full'>
        <input {...getInputProps()} />
        { children }
      </Box>
    </DropzoneContext.Provider>
  );
}