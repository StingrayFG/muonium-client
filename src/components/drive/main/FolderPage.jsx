import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';

import { setAbsolutePath, setInitial, confirmUpdate, requestUpdate } from 'services/slice/PathSlice';

import FileService from 'services/FileService.jsx';
import FileElement from 'components/drive/main/element/FileElement.jsx';
import FileContextMenu from 'components/drive/main/menu/FileContextMenu.jsx';
import TrashFileContextMenu from 'components/drive/main/menu/TrashFileContextMenu.jsx';

import FolderService from 'services/FolderService.jsx'
import FolderElement from 'components/drive/main/element/FolderElement.jsx';
import FolderContextMenu from 'components/drive/main/menu/FolderContextMenu.jsx';
import TrashFolderContextMenu from 'components/drive/main/menu/TrashFolderContextMenu.jsx';

import DefaultContextMenu from 'components/drive/main/menu/DefaultContextMenu.jsx';

export default function FolderPage ({ path }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const pathData = useSelector(state => state.path);

  const [file, setFile] = useState();
  const [requiresUpload, setRequiresUpload] = useState();

  const [requiresUpdate, setRequiresUpdate] = useState(true);
  const [currentFolder, setCurrentFolder] = useState();

  const { uuid } = useParams();

  if (!path) { 
    path = uuid;
  }

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
      FileService.handleUpload(userData, file, path)
      .then(res => {
        dispatch(requestUpdate());
      })
      setRequiresUpload(false);
    }
  });

  useEffect(() => {
    if (requiresUpdate) {
      FolderService.handleGet(userData, path)
      .then(res => {
        setCurrentFolder(res);
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
  
  const [creatingFolder, setCreatingFolder] = useState();

  // Path
  useEffect(() => {
    if (!pathData.currentPath) {
      dispatch(setInitial({uuid: path}));
    }
  });

  useEffect(() => {
    if (path !== pathData.currentPath) {
      if (pathData.currentPath === 'trash') { 
        navigate('/drive/trash'); 
      }
      else if (pathData.currentPath === 'root') { 
        navigate('/drive/home'); 
      }
      else if (pathData.currentPath) { 
        navigate('/drive/folder/' + pathData.currentPath); 
      }
    }
  });

  useEffect(() => {
    if (currentFolder) {
      if (pathData.currentPath === 'trash') { 
        dispatch(setAbsolutePath({ absolutePath: '/trash' }));
      }
      else if (pathData.currentPath === 'root') { 
        dispatch(setAbsolutePath({ absolutePath: '/root'}));
      }
      else if (pathData.currentPath) { 
        dispatch(setAbsolutePath({ absolutePath: currentFolder.absolutePath }));
      }
    }
    //console.log(pathData)
  });

  //Update
  useEffect(() => {
    if (pathData.requiresUpdate) { 
      setRequiresUpdate(true);
      dispatch(confirmUpdate());
    }
  });
  

  return (
    <div className='w-full h-full px-4 py-4
    bg-gradient-to-b from-zinc-600/90 to-zinc-700/90'
    {...getRootProps()} 
    onContextMenu={handleContextMenuClick}>
      <input {...getInputProps()} />
      <div className='grid grid-cols-6'>
        {creatingFolder && (
          <FolderElement folder={{ parentUuid: path, uuid: 'placeholder', name: '' }} 
          renaming={creatingFolder} setRenaming={setCreatingFolder} clickedElement={{ uuid: 'placeholder' }} />
        )}

        {currentFolder && <>
          {currentFolder.files.map((file) => (
            <FileElement key={file.uuid} file={file} handleContextMenuClick={handleFileContextMenuClick} 
            renaming={renaming} setRenaming={setRenaming} clickedElement={clickedElement}/>
          ))}
          {currentFolder.folders.map((folder) => (
            <FolderElement key={folder.uuid} folder={folder} handleContextMenuClick={handleFolderContextMenuClick} 
            renaming={renaming} setRenaming={setRenaming} clickedElement={clickedElement}/>
          ))}
        </>}
        
        {((pathData.currentPath !== 'trash') && clicked) && <>
          {(contextMenuType === 'default') && <DefaultContextMenu point={point} setCreatingFolder={setCreatingFolder}/>}
          {(contextMenuType === 'file') && <FileContextMenu point={point} file={clickedElement} setRenaming={setRenaming}/>}
          {(contextMenuType === 'folder') && <FolderContextMenu point={point} folder={clickedElement} setRenaming={setRenaming}/>}  
        </>}

        {((pathData.currentPath === 'trash') && clicked) && <>
          {(contextMenuType === 'file') && <TrashFileContextMenu point={point} file={clickedElement} />}
          {(contextMenuType === 'folder') && <TrashFolderContextMenu point={point} folder={clickedElement} />}  
        </>}


      </div>
    </div>
  );
}