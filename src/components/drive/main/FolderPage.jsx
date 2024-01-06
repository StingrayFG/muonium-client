import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function FolderPage () {
  const userData = JSON.parse(localStorage.getItem('user')) || {a: 1};

  const [file, setFile] = useState();
  const [fileUuid, setFileUuid] = useState();

  const [requiresUpload, setRequiresUpload] = useState();
  const [progress, setProgress] = useState(0);

  const [children, setChildren] = useState();

  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
    handleChange(acceptedFiles[0])
  }, []);

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop, multiple: false, noDragEventsBubbling: true, //noClick: true
  });


  const handleChange = (file) => {
    setFile(file);
    if (file.size < (1024 * 1024 * 100)) {
      setRequiresUpload(true);
    } else {
      setProgress(0);
    }
  };

  useEffect(() => {
    if (requiresUpload)
    {
      handleSubmit();
      setRequiresUpload(false);
    }
  });


  const handleSubmit = async () => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };

    const formData = new FormData();
    formData.append('file', file);

    formData.append('body', JSON.stringify({ ownerUuid: userData.userUuid, parentUuid: '/root', driveUuid: userData.driveUuid }));
    
    await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/upload', formData, {headers}, {
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total);
        setProgress(progress);
      }})
      .then(res => {
        setFileUuid(res.data.fileUuid)
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <div className='w-full h-full
      bg-neutral-600' {...getRootProps()}>
      <input {...getInputProps()} />
    </div>
  );
}