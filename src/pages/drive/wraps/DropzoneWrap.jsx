import { useContext, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';

import { requestUpdate } from 'state/slices/PathSlice';

import { DropzoneContext } from 'contexts/DropzoneContext';
import { FolderContext } from 'contexts/FolderContext';

import FileService from 'services/FileService.jsx';

export default function DropzoneWrap ({ children }) {
  const folderContext = useContext(FolderContext);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const driveData = useSelector(state => state.drive);

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
    if (file && (file.size < (1024 * 1024 * process.env.REACT_APP_MAX_FILE_SIZE))) {
      setRequiresUpload(true);
    }
  };

  useEffect(() => {
    if (requiresUpload) {
      FileService.handleUpload(userData, driveData, { parentUuid: folderContext.currentFolder.uuid }, file)
      .then(() => {
        dispatch(requestUpdate());
      })
      setRequiresUpload(false);
    }
  });

  return (
    <DropzoneContext.Provider value={{ open }}>
      <div {...getRootProps()} className='w-full h-full'>
        <input {...getInputProps()} />
        { children }
      </div>
    </DropzoneContext.Provider>
  );
}