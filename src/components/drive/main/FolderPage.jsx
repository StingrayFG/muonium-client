import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import FileService from 'services/FileService.jsx';
import FileElement from 'components/drive/main/element/FileElement.jsx';
import FileContextMenu from 'components/drive/main/menu/FileContextMenu.jsx';

import FolderService from 'services/FolderService.jsx'
import FolderElement from 'components/drive/main/element/FolderElement.jsx';
import FolderContextMenu from 'components/drive/main/menu/FolderContextMenu.jsx';

import DefaultContextMenu from 'components/drive/main/menu/DefaultContextMenu.jsx';

export default function FolderPage ({ address }) {
  const userData = useSelector(state => state.user);

  const [file, setFile] = useState();
  const [requiresUpload, setRequiresUpload] = useState();

  const [requiresUpdate, setRequiresUpdate] = useState(true);
  const [children, setChildren] = useState();

  // Dropzone
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
    handleChange(acceptedFiles[0])
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop, multiple: false, noDragEventsBubbling: true, noClick: true, noKeyboard: true,
  });

  const handleChange = (file) => {
    setFile(file);
    if (file && (file.size < (1024 * 1024 * 100))) {
      setRequiresUpload(true);
    }
  };

  // Upload
  useEffect(() => {
    if (requiresUpload) {
      FileService.handleUpload(userData, file, address);
      setRequiresUpload(false);
    }
  });

  useEffect(() => {
    if (requiresUpdate) {
      FolderService.handleGet(userData, address)
      .then(res => {
        setChildren(res);
      })
      .catch(err => {
        console.error(err);
      });  
      setRequiresUpdate(false);
    }
  });

  // Context menu
  const [clicked, setClicked] = useState(false);
  const [clickedElement, setClickedElement] = useState();
  const [point, setPoint] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuType, setContextMenuType] = useState('default');

  useEffect(() => {
    const handleClick = () => setClicked(false);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleFileContextMenuClick = (event, file) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenuType('file')
    setClickedElement(file);
    setClicked(true);
    setPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleFolderContextMenuClick = (event, folder) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenuType('folder')
    setClickedElement(folder);
    setClicked(true);
    setPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleContextMenuClick = (event) => {
    event.preventDefault();

    setContextMenuType('default')
    setClicked(true);
    setPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  // Rename
  const [renaming, setRenaming] = useState();
  const enableRenaming = () => {
    setRenaming(true);
  };

  const [creatingFolder, setCreatingFolder] = useState();
  const createFolder = () => {
    setCreatingFolder(true);
    console.log('enabled')
  };


  return (
    <div className='w-full h-full px-4 py-4
    bg-gradient-to-b from-zinc-600 to-zinc-600'
    {...getRootProps()} 
    onContextMenu={handleContextMenuClick}>
      <input {...getInputProps()} />
      <div className='grid grid-cols-6 grid-rows-1'>
        {creatingFolder && (
          <FolderElement folder={{ parentUuid: address, uuid: 'placeholder', name: '' }} 
          renaming={creatingFolder} setRenaming={setCreatingFolder} clickedElement={{ uuid:'placeholder' }} />
        )}

        {children && <>
          {children.files.map((file) => (
            <FileElement key={file.uuid} file={file} handleContextMenuClick={handleFileContextMenuClick} 
            renaming={renaming} setRenaming={setRenaming} clickedElement={clickedElement}/>
          ))}
          {children.folders.map((folder) => (
            <FolderElement key={folder.uuid} folder={folder} handleContextMenuClick={handleFolderContextMenuClick} 
            renaming={renaming} setRenaming={setRenaming} clickedElement={clickedElement}/>
          ))}
        </>}

        {(clicked && (contextMenuType === 'default')) && (
          <DefaultContextMenu point={point} createFolder={createFolder}/>        
        )}
        {(clicked && (contextMenuType === 'file')) && (
          <FileContextMenu point={point} file={clickedElement} enableRenaming={enableRenaming}/>
        )}
        {(clicked && (contextMenuType === 'folder')) && (
          <FolderContextMenu point={point} folder={clickedElement} enableRenaming={enableRenaming}/>
        )}
      </div>
    </div>
  );
}