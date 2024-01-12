import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';

import { ContextMenuContext } from 'components/drive/main/context/ContextMenuContext.jsx';
import { FolderContext } from 'components/drive/main/context/FolderContext.jsx';

import FileContextMenu from 'components/drive/main/menu/FileContextMenu.jsx';
import TrashFileContextMenu from 'components/drive/main/menu/TrashFileContextMenu.jsx';
import FolderContextMenu from 'components/drive/main/menu/FolderContextMenu.jsx';
import TrashFolderContextMenu from 'components/drive/main/menu/TrashFolderContextMenu.jsx';
import DefaultContextMenu from 'components/drive/main/menu/DefaultContextMenu.jsx';

export default function FolderPage ({ children }) {
  const folderContext = useContext(FolderContext);

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

  const handleDefaultContextMenuClick = (event) => {
    event.preventDefault();

    setContextMenuType('default')
    setClicked(true);
    setPoint({
      x: event.pageX,
      y: event.pageY,
    });
  };

  // Rename
  const [renaming, setRenaming] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);

  return (
    <div className='w-full h-full'
    onContextMenu={handleDefaultContextMenuClick}>
      <ContextMenuContext.Provider value={{ handleFileContextMenuClick, handleFolderContextMenuClick, clickedElement, renaming, setRenaming, creatingFolder, setCreatingFolder }}> 
        {children}
        {(clicked) && <>
          {(folderContext.currentFolder.uuid !== 'trash') && <>
            {(contextMenuType === 'default') && <DefaultContextMenu point={point} setCreatingFolder={setCreatingFolder}/>}
            {(contextMenuType === 'file') && <FileContextMenu point={point} file={clickedElement} setRenaming={setRenaming}/>}
            {(contextMenuType === 'folder') && <FolderContextMenu point={point} folder={clickedElement} setRenaming={setRenaming}/>}  
          </>}

          {(folderContext.currentFolder.uuid  === 'trash') && <>
            {(contextMenuType === 'file') && <TrashFileContextMenu point={point} file={clickedElement} />}
            {(contextMenuType === 'folder') && <TrashFolderContextMenu point={point} folder={clickedElement} />}  
          </>}
        </>}
      </ContextMenuContext.Provider> 
    </div>
  );
}